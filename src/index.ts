import * as Discord from "discord.js";
import * as dotenv from "dotenv";

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
            interaction.channel.send("Code for this bot can be found here: https://github.com/rmedcraft/Kitchen-Guy\n\nFind the rest of my projects at https://github.com/rmedcraft")
        }
    }
});

client.login(process.env.token);