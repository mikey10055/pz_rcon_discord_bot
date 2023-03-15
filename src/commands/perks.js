const {
    SlashCommandBuilder
} = require('discord.js');
const {
    playerAutoComplete
} = require('../autocompletes/playerAutoComplete');
const { rconCommand } = require('../helper');
const cmd = require('../pzcommands');

const {
    PZ_USER,
    PZ_INVALID_PERK
} = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perks")
        .setDescription("Display a list of perks")
        ,
    async execute(interaction, rconConnection, timers, log) {
        const response = await rconCommand((rcon) => {
            cmd.players(rcon);
        });
        if (response.startsWith("Players connected")) {
            const player = response.split("-")[1];
            cmd.addxp(rconConnection, player, PZ_INVALID_PERK, 0);
            return;
        }

        interaction.editReply({
            content: "no valid player"
        });

    }
};