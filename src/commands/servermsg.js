const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("servermsg")
        .setDescription("Broadcast a message to all connected players.")
        .addStringOption(option => option.setName("message").setDescription("Enter message").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction) {
        if (!ConnectedToRconServer) {
            notConnectedToRcon(interaction);
        } else {
            const msg = interaction.options.getString('message');
            cmd.servermsg(rconConnection, msg);
            await interaction.reply({
                content: `Server message \`${msg}\` sent`,
                ephemeral: false
            });
        }
    },
};