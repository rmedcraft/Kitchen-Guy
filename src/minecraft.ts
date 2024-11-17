import axios from "axios";

export async function online(interaction, serverIP: string) {
    const uri = `https://api.mcsrvstat.us/3/${serverIP}`;

    const { data } = await axios.get(uri);

    console.log(data);
    if (data.ip === "127.0.0.1") {
        interaction.reply("You didn't enter a valid server IP");
        return;
    }

    if (!data.online) {
        interaction.reply("Server is Offline");
        return;

    }
    const players = data.players;
    let outputMessage = `Online Players in ${serverIP}: \n\n`;

    if (!(typeof data[Symbol.iterator] === "function")) {
        interaction.reply(`There are ${players.online} players on ${serverIP}, I can't list all of them!`);
        return;
    }
    
    for (const player of players.list) {
        outputMessage += `- ${player.name}\n`;
    }

    interaction.reply(outputMessage);
}

export async function version(interaction, serverIP) {
    const uri = `https://api.mcsrvstat.us/3/${serverIP}`;

    const { data } = await axios.get(uri);
    console.log(data);

    if (data.ip === "127.0.0.1") {
        interaction.reply("You didn't enter a valid server IP");
        return;
    }

    if (!data.online) {
        interaction.reply("Server is Offline");
        return;
    }

    interaction.reply(`${serverIP} is running on version **${data.version}**`);
}