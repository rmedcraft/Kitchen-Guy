import * as Discord from "discord.js";
import * as dotenv from "dotenv";

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
})

client.on("ready", () => {
    console.log("Bot is ready :O");
});

// bot code here!

client.login(process.env.token);