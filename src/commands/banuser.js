const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("banuser")
        .setDescription("Ban a user.")
        .addStringOption(option => option.setName("user").setDescription("Username").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .addBooleanOption(option => option.setName("ip").setDescription("Should ban the users ip. Defaults to false"))
        .addStringOption(option => option.setName("reason").setDescription("Reason the user is banned."))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const user = interaction.options.getString("user");
        const ip = interaction.options.getBoolean("ip");
        const reason = interaction.options.getString("reason");

        cmd.banuser(rconConnection, user, ip, reason);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};