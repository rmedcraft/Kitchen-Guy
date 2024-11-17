import * as dotenv from "dotenv";
dotenv.config();

// const { Routes } = require("discord-api-types/v10");
import { Routes } from "discord-api-types/v10";


// const { REST } = require("@discordjs/rest");
import { REST } from "@discordjs/rest";
// const { SlashCommandBuilder } = require("@discordjs/builders");
import { SlashCommandBuilder } from "@discordjs/builders";


const botID = "1306344304926785748"; // KITCHEN GUY ID
const botToken = process.env.TOKEN;

const rest = new REST().setToken(botToken);
export const slashRegister = async (serverID) => {
    try {
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder().setName("github").setDescription("Look at the code for this bot"),
                new SlashCommandBuilder()
                    .setName("rps")
                    .setDescription("Play Rock Paper Scissors with someone")
                    .addUserOption((option) =>
                        option.setName("opponent")
                            .setDescription("The user you're challenging to a RPS game")
                            .setRequired(true)),
                new SlashCommandBuilder().setName("coinflip").setDescription("Flip a coin"),
                new SlashCommandBuilder()
                    .setName("minecraft")
                    .setDescription("See who's online in a minecraft server")
                    .addStringOption((option) =>
                        option.setName("ip")
                            .setDescription("The server you want to see whos online for")
                            .setRequired(true)
                    )
            ],
        });
    } catch (error) {
        console.error(error);
    }
};