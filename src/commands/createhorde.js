const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("createhorde")
        .setDescription("Spawn a horde near a player")
        .addIntegerOption(option => option.setName("count").setDescription("Size of the horde").setRequired(true))
        .addStringOption(option => option.setName("player").setDescription("Player to spawn the horde near.").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const count = interaction.options.getInteger("count");
        const player = interaction.options.getString("player");
        if (parseInt(count) > 2147483647) {
            interaction.editReply({
                content: "count is to large, must be 2147483647 or smaller"
            });
            return;
        } 
        cmd.createhorde(rconConnection, count, player);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};