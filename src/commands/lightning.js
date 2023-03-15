const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("lightning")
        .setDescription("Sound lightning over a player.")
        .addStringOption(option => option.setName("player").setDescription("Player to set lightning on").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const user = interaction.options.getString("player");
        cmd.lightning(rconConnection, user);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};