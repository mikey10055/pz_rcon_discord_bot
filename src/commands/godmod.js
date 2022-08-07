const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("godmod")
        .setDescription("Make a player invincible. enable/disable godmode")
        .addStringOption(option => option.setName("player").setDescription("Player to enable/disable").setRequired(true))
        .addBooleanOption(option => option.setName("enabled").setDescription("Enable or Disable").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        const enabled = interaction.options.getBoolean("enabled");
        cmd.godmod(rconConnection, player, enabled);
    },
};