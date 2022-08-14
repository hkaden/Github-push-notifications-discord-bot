import Hapi from "@hapi/hapi";
import { db, mongodbClient } from "./database";

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { commands } from "./commands";
import { githubWebhookHandler } from "./handler";
import "dotenv/config";
import { discordClient } from "./discord";
const { DB_URL = "", DB_NAME, TOKEN, CLIENT_ID = "", PORT } = process.env;

if (!DB_URL) process.exit(600);
if (!DB_NAME) process.exit(601);
if (!TOKEN) process.exit(602);
if (!CLIENT_ID) process.exit(603);

const rest = new REST({ version: "10" }).setToken(TOKEN);

const init = async () => {
    const server = Hapi.server({
        port: PORT,
        host: "localhost",
    });

    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        });

        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.log(
            "There was some error when setting up the slash commands. See below."
        );
        console.error(error);
    }

    try {
        await discordClient.login(TOKEN);
        console.log(`Logged in to Discord as ${discordClient?.user?.tag}!`);
    } catch (error) {
        console.log(
            "There was some error when logging into Discord. See below."
        );
        console.dir(error);
    }

    try {
        await mongodbClient.connect();
        console.log("Logged in to MongoDB!");
    } catch (error) {
        console.log(
            "There was some error when connecting to MongoDB. See below."
        );
        console.dir(error);
    }

    server.route({
        method: "GET",
        path: "/",
        handler: () => {
            return "Hello World!";
        },
    });

    server.route({
        method: "POST",
        path: "/webhook/github/{uuid}",
        handler: githubWebhookHandler,
    });

    await server.start();
    console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

init();
