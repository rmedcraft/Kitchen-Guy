import axios from "axios";

export async function minecraftData(interaction, serverIP: string) {
    const uri = `https://api.mcsrvstat.us/3/${serverIP}`;

    const { data } = await axios.get(uri);

    if (!data.online) {
        interaction.channel.send("Server is Offline");
    } else {
        const players = data.players;
        let outputMessage = "Online Players: \n\n";

        for (const player of players.list) {
            outputMessage += `${player.name}\n`;
        }

        interaction.reply(outputMessage);
    }
};