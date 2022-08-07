const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("lightning")
        .setDescription("Sound lightning over a player.")
        .addStringOption(option => option.setName("player").setDescription("Player to set lightning on").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const user = interaction.options.getString("player");
        cmd.lightning(rconConnection, user);
    },
};