import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { RPS } from "./RPS";
dotenv.config();

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
});

client.on("ready", () => {
    console.log("Bot is ready :O");
});

// bot code here!
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand()) {
        // check commands  
        if (interaction.commandName === "github") {
            interaction.channel.send("Code for this bot can be found here: https://github.com/rmedcraft/Kitchen-Guy\n\nFind the rest of my projects at https://github.com/rmedcraft");
        }
        if (interaction.commandName === "rps") {
            RPS(interaction);
        }
        if (interaction.commandName === "coinflip") {
            const random = Math.floor(Math.random() * 2);
            if (random === 0) {
                interaction.reply("The coin landed on **Heads**");
            } else {
                interaction.reply("The coin landed on **Tails**");
            }
        }
    }
});

client.login(process.env.TOKEN);