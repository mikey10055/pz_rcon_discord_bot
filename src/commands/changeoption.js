const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("changeoption")
        .setDescription("Change a server option")
        .addStringOption(option => option.setName("option").setDescription("Option to change.").setRequired(true))
        .addStringOption(option => option.setName("value").setDescription("Value to change option to.").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const option = interaction.options.getString("option");
        const value = interaction.options.getString("value");

        cmd.changeoption(rconConnection, option, value);
    },
};