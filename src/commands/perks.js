const {
    SlashCommandBuilder
} = require('discord.js');
const {
    playerAutoComplete
} = require('../autocompletes/playerAutoComplete');
const cmd = require('../pzcommands');

const {
    PZ_USER,
    PZ_INVALID_PERK
} = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("perks")
        .setDescription("Display a list of perks")
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        cmd.addxp(rconConnection, PZ_USER, PZ_INVALID_PERK, 0);
    }
};