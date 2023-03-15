const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("unbanid")
        .setDescription("Unban a SteamID.")
        .addStringOption(option => option.setName("steamid").setDescription("Users Steam ID").setRequired(true))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const steamid = interaction.options.getString("steamid");
        cmd.unbanid(rconConnection, steamid);
    },
};