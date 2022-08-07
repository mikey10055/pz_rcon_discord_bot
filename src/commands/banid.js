const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("banid")
        .setDescription("Ban a SteamID.")
        .addStringOption(option => option.setName("steamid").setDescription("Users Steam ID").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const steamid = interaction.options.getString("steamid");
        cmd.banid(rconConnection, steamid);
    },
};