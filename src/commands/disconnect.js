const {
    SlashCommandBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnect from server")
        .setDefaultMemberPermissions(0),
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction) {
        if (ConnectedToRconServer) {
            await interaction.deferReply({
                ephemeral: false
            });
            setLastInteraction(interaction);
            rconConnection.disconnect();
        } else {
            await interaction.reply({
                content: 'Not connected to server.',
                ephemeral: false
            });
        }
    }
};