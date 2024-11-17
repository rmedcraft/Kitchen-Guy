import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { RPS } from "./RPS";
import { slashRegister } from "./slashRegistry";
import { online, version } from "./minecraft";
dotenv.config();

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
});

client.on("ready", () => {
    console.log("Bot is ready :O");
});

// registers the slash commands individually for each server the bot joins.
// its possible to register the commands without the serverID, but that takes an hour to go through and I no wanna during testing
client.on("guildCreate", (guild) => {
    slashRegister(guild.id);
});

// bot code here!
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.isChatInputCommand()) {
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
        if (interaction.commandName === "minecraft") {
            const ip = interaction.options.getString("ip");
            if (interaction.options.getSubcommand() === "online") {
                online(interaction, ip);
            }

            if (interaction.options.getSubcommand() === "version") {
                version(interaction, ip);
            }
        }
    }
});

client.login(process.env.TOKEN);