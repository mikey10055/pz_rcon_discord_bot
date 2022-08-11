const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');

const { isAutoCompleteOn } = require('../helper');
const { optionsAutoComplete } = require('../autocompletes/optionsAutoComplete');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("changeoption")
        .setDescription("Change a server option")
        .addStringOption(option => option.setName("option").setDescription("Option to change. (This is case sensitive)").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .addStringOption(option => option.setName("value").setDescription("Value to change option to.").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const option = interaction.options.getString("option");
        const value = interaction.options.getString("value");

        cmd.changeoption(rconConnection, option, value);
    },
    async autocomplete(interaction) {
        optionsAutoComplete(interaction)
    }
};