const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("createhorde")
        .setDescription("Spawn a horde near a player")
        .addIntegerOption(option => option.setName("count").setDescription("Size of the horde").setRequired(true))
        .addStringOption(option => option.setName("player").setDescription("Player to spawn the horde near.").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const count = interaction.options.getInteger("count");
        const player = interaction.options.getString("player");
        cmd.createhorde(rconConnection, count, player);
    },
};