const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("unbanuser")
        .setDescription("Unban a player.")
        .addStringOption(option => option.setName("user").setDescription("Username").setRequired(true))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const user = interaction.options.getString("user");
        cmd.unbanuser(rconConnection, user);
    },
};