const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("connect")
        .setDescription("Connect to server")
        .setDefaultMemberPermissions(0),
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction) {
        if (!ConnectedToRconServer) {
            await interaction.deferReply({ ephemeral: false });
            setLastInteraction(interaction);
            rconConnection.connect();
        } else {
            await interaction.reply({
                content: 'Already connected to server.',
                ephemeral: false
            });
        }
    },
};