import {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    Interaction,
    ChatInputCommandInteraction,
} from "discord.js";
import { db } from "./database";
import { v4 as uuidv4 } from "uuid";
import { add, remove } from "./controller";
import "dotenv/config";
export const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds],
});

discordClient.on("interactionCreate", async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const subscriptions = db.collection("subscriptions");

    try {
        const { channelId } = interaction;
        const webhookUUID = uuidv4();
        const OptionChannelId = interaction.options.getString("channel");
        switch (interaction.commandName) {
            case "add":
                if (
                    await add(
                        webhookUUID,
                        OptionChannelId ? OptionChannelId : channelId,
                        subscriptions
                    )
                ) {
                    const embed = new EmbedBuilder()
                        .setTitle("成功訂閱左個webhook")
                        .setDescription(
                            `***Webhook UUID:*** ${webhookUUID}\n***Channel ID:*** ${
                                OptionChannelId ? OptionChannelId : channelId
                            } \n ***Webhook URL:*** ${
                                process.env.BASE_URL
                            }/webhook/github/${webhookUUID}`
                        )
                        .setColor(0x00ff00);
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                } else {
                    const embed = new EmbedBuilder()
                        .setTitle("訂閱失敗")
                        .setDescription("可能係你已經訂閱過果個Channel ID")
                        .setThumbnail(
                            "https://upload.cc/i1/2022/08/14/SQ6UpE.png"
                        )
                        .setColor(0xff0000);
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }
                break;
            case "remove":
                const uuid = interaction.options.getString("uuid");
                if (uuid) {
                    await remove(uuid, subscriptions);
                    const embed = new EmbedBuilder()
                        .setTitle("成功刪除左個webhook")
                        .setThumbnail(
                            "https://upload.cc/i1/2022/08/14/SQ6UpE.png"
                        )
                        .setDescription(`***Webhook UUID:*** ${uuid}`)
                        .setColor(0x00ff00);
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true,
                    });
                }

                break;
            default:
                break;
        }
    } catch (error) {
        console.log("There was some error adding or removing. See below.");
        console.dir(error);
    }
});
