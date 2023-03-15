const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');
const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("adduser")
        .setDescription("Use this command to add a new user to a whitelisted server.")
        .addStringOption(option => option.setName("username").setDescription("Username").setRequired(true))
        .addStringOption(option => option.setName("password").setDescription("Password").setRequired(true)),
    async execute(interaction, rconConnection, timers, log) {

            const user = interaction.options.getString('username');
            const pass = interaction.options.getString('password');

            cmd.adduser(rconConnection, user, pass);
    },
    async reply(interaction, response) {
        const user = interaction.options.getString('username');

        if (response.startsWith(`User ${user} created`)) {
            interaction.editReply(`Added user ${user} to the whitelist`);
        } else if (response.startsWith("Use this command")) {
            interaction.editReply("Unable to execute command, please check the parameters and try again");
        } else {
            interaction.editReply(response);
        }
    }
};