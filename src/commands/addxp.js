const {
    SlashCommandBuilder
} = require('discord.js');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addxp")
        .setDescription("Give XP to a player.")
        .addStringOption(option => option.setName("player").setDescription("player to give xp too").setRequired(true))
        .addStringOption(option => option.setName("perk").setDescription("perk").setRequired(true))
        .addIntegerOption(option => option.setName("xp").setDescription("xp to add").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {

            const player = interaction.options.getString('player');
            const perk = interaction.options.getString('perk');
            const xp = interaction.options.getInteger('xp');

            cmd.addxp(rconConnection, player, perk, xp);
    },
};