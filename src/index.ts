import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { RPS } from "./RPS";
import { slashRegister } from "./slashRegistry";
import { online, version } from "./minecraft";
import connectToDatabase from "./mongo";
dotenv.config();

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMembers", "GuildMessageReactions", "DirectMessageReactions"]
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
            interaction.reply("Code for this bot can be found here: https://github.com/rmedcraft/Kitchen-Guy\n\nFind the rest of my projects at https://github.com/rmedcraft");
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
        if (interaction.commandName === "channels") {
            if (interaction.user.id !== "302174399283462146") {
                interaction.reply("Only rowan can run this command :3");
                return;
            }
            const db = await connectToDatabase();
            const collection = db.collection("servers");

            const serverInfo = await collection.find({ serverID: interaction.guild.id }).toArray();
            // verifies the server info exists
            if (serverInfo.length === 0) {
                collection.insertOne({ serverID: interaction.guild.id });
            }

            if (interaction.options.getSubcommand() === "changeall") {
                const name = interaction.options.getString("name");

                const channelData = {};

                interaction.guild.channels.cache.forEach(async channel => {
                    // add a list of each channelID and its name to an array & put that in mongodb, if the mongodb entry already exists dont do that

                    channelData[channel.id] = channel.name;

                    await channel.setName(name);
                });

                // const userData = {};
                // interaction.guild.members.cache.forEach(async (user) => {
                //     if (user.roles.highest.position < interaction.guild.members.resolve(client.user).roles.highest.position) {
                //         userData[user.id] = user.nickname;

                //         await user.setNickname(name);
                //     }
                // });


                // serverInfo exists if the channelData doesnt exist, we want to update the database if the channelData doesnt exist, dont otherwise
                const serverInfo = await collection.findOne({ serverID: interaction.guild.id, channelData: { $exists: false } });
                if (serverInfo) {
                    collection.updateOne({ serverID: interaction.guild.id }, { $set: { channelData: channelData } });
                    // collection.updateOne({ serverID: interaction.guild.id }, { $set: { userData: userData } });

                    // DM rowan the json for manually reverting this (if necessary)
                    const rowan = interaction.guild.members.cache.get("302174399283462146");
                    const rowanDM = await rowan.createDM();

                    let objString = "{ ";

                    Object.entries(channelData).forEach(([key, value]: [string, string]) => {
                        objString += `"${key}": "${value}", `;
                    });

                    objString = objString.substring(0, objString.length - 2);

                    objString += " }";

                    let sendString = `In case the data doesnt get added to mongo: \ndb.servers.updateOne({serverID: "${interaction.guild.id}"}, $set: {channelData: ${objString}})`;

                    rowanDM.send(sendString);
                } else {
                    console.log('server data not updated');
                }

                interaction.reply("Changed all channel names to " + name);
                console.log(channelData);
            }
            if (interaction.options.getSubcommand() === "revert") {
                await interaction.deferReply();
                // get the mongoDB entry, get each channel by its channelID, revert them all back to what they were before, delete the mongoDB entry
                const serverInfo = await collection.findOne({ serverID: interaction.guild.id });
                const channelData = serverInfo.channelData;

                if (!channelData) {
                    interaction.reply("No channel data to revert back to");
                    return;
                }

                console.log(channelData);

                Object.entries(channelData).forEach(([key, value]: [string, string]) => {
                    const channel = interaction.guild.channels.cache.get(key);
                    channel.setName(value);
                });

                // const userData = serverInfo.userData;
                // console.log("Bot Name", interaction.guild.members.resolve(client.user).nickname);
                // Object.entries(userData).forEach(([key, value]: [string, string]) => {
                //     const user = interaction.guild.members.cache.get(key);
                //     if (user.roles.highest.position < interaction.guild.members.resolve(client.user).roles.highest.position) {
                //         user.setNickname(value);
                //     }
                // });

                // deletes the entry so it knows to update it if this is ever run again
                await collection.updateOne({ serverID: interaction.guild.id }, { $unset: { channelData: {} } });
                // await collection.updateOne({ serverID: interaction.guild.id }, { $unset: { userData: {} } });

                interaction.editReply("All names have been reverted back");
            }
        }
    }
});

client.login(process.env.TOKEN);