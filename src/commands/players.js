const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("players")
        .setDescription("List all connected players.")
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
            cmd.players(rconConnection);
    },
    async reply(interaction, response) {
        if (response.startsWith("Players connected")) {
            const players = response.split("-")

            const description = players.filter((name, indx) => indx > 0).join("");

            const responseEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(players[0].replace(":", ""))
                .setDescription(description.length > 0 ? description : "no players online")
                .setTimestamp()

            interaction.editReply({
                embeds: [responseEmbed]
            })
        
            return;
        }

        interaction.editReply(response);
    } 
};