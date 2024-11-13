import * as Discord from "discord.js";
import * as dotenv from "dotenv";

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
})