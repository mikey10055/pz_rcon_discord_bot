const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user.")
        .addStringOption(option => option.setName("player").setDescription("Player to kick").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for kick"))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        const reason = interaction.options.getString("reason");
        cmd.kick(rconConnection, player, reason);
    },
};