const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');

const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("godmod")
        .setDescription("Make a player invincible. enable/disable godmode")
        .addStringOption(option => option.setName("player").setDescription("Player to enable/disable").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .addBooleanOption(option => option.setName("enabled").setDescription("Enable or Disable").setRequired(true))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        const enabled = interaction.options.getBoolean("enabled");
        cmd.godmod(rconConnection, player, enabled);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};