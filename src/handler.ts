import { eventParser } from "./utils";
import { db } from "./database";
import { discordClient } from "./discord";
import { TextChannel } from "discord.js";
import Hapi from "@hapi/hapi";

export const githubWebhookHandler = async (request: Hapi.Request) => {
    const event = request.headers["x-github-event"];
    const { uuid } = request.params;
    const message = eventParser(event, request.payload);
    const subscription = db.collection("subscriptions");
    const res = await subscription.findOne({ uuid });
    if (res) {
        const { channelId } = res;
        const channel = await discordClient.channels.cache.get(channelId);
        if (channel) {
            try {
                await (channel as TextChannel).send({ embeds: [message] });
                return { success: true };
            } catch (error) {
                console.log(
                    "There was an error sending the Discord message. See below."
                );
                console.dir(error);
            }
        }
    } else {
        return { code: 404, message: "Webhook Not found" };
    }

    return null;
};
