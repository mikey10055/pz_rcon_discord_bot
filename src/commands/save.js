const {
    SlashCommandBuilder
} = require('discord.js');
const { notConnectedToRcon } = require('../helper');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("save")
        .setDescription("Save the current world.")
        .setDefaultMemberPermissions(0),
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction) {
        if (!ConnectedToRconServer) {
            notConnectedToRcon(interaction);
        } else {
            setLastInteraction(interaction);
            await interaction.deferReply({
                ephemeral: false
            });

            cmd.save(rconConnection);
        }
    },
};