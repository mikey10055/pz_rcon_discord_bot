const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("removeuserfromwhitelist")
        .setDescription("Remove a user from the whitelist.")
        .addStringOption(option => option.setName("player").setDescription("Player to remove from whitelist").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        cmd.removeuserfromwhitelist(rconConnection, player);
    },
};