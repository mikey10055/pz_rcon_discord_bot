const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("removeuserfromwhitelist")
        .setDescription("Remove a user from the whitelist.")
        .addStringOption(option => option.setName("player").setDescription("Player to remove from whitelist").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        cmd.removeuserfromwhitelist(rconConnection, player);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};