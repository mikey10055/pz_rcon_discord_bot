const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const {
    notConnectedToRcon, isAutoCompleteOn
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teleportto")
        .setDescription("Teleport player to x,y,z coordinates. Once teleported, wait for the map to appear.")
        .addStringOption(option => option.setName("player").setDescription("Enter player to teleport").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .addIntegerOption(option => option.setName("x").setDescription("x coordinate").setRequired(true))
        .addIntegerOption(option => option.setName("y").setDescription("y coordinate").setRequired(true))
        .addIntegerOption(option => option.setName("z").setDescription("z coordinate").setRequired(true))
        ,
    async execute(interaction, rconConnection, timers, log) {
            const p = interaction.options.getString('player');
            const x = interaction.options.getInteger('x');
            const y = interaction.options.getInteger('y');
            const z = interaction.options.getInteger('z');

            cmd.teleportto(rconConnection, p, x, y, z);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};