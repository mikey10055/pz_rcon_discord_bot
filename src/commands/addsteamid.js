const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');
const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addsteamid")
        .setDescription("Use this command to add a new Steam ID")
        .addStringOption(option => option.setName("steamid").setDescription("Steam ID").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {

        const steamID = interaction.options.getString('steamid');

        cmd.addsteamid(rconConnection, steamID);
    },
    async reply(interaction, response) {
        const steamID = interaction.options.getString('steamid');

        if (response.startsWith(`SteamID ${steamID} added`)) {
            interaction.editReply(`Added steamID ${steamID}`);
        } else if (response.startsWith("Use this command")) {
            interaction.editReply("Unable to execute command, please check the parameters and try again");
        } else {
            interaction.editReply(response);
        }
    }
};