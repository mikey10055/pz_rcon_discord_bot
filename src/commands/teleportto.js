const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("teleportto")
        .setDescription("Teleport player to x,y,z coordinates. Once teleported, wait for the map to appear.")
        .addStringOption(option => option.setName("player").setDescription("Enter player to teleport").setRequired(true))
        .addNumberOption(option => option.setName("x").setDescription("x coordinate").setRequired(true))
        .addNumberOption(option => option.setName("y").setDescription("y coordinate").setRequired(true))
        .addNumberOption(option => option.setName("z").setDescription("z coordinate").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction) {
        if (!ConnectedToRconServer) {
            notConnectedToRcon(interaction);
        } else {
            const p = interaction.options.getString('player');
            const x = interaction.options.getNumber('x');
            const y = interaction.options.getNumber('y');
            const z = interaction.options.getNumber('z');

            setLastInteraction(interaction);
            await interaction.deferReply({
                ephemeral: false
            });
            cmd.teleportto(rconConnection, p, x, y, z);

        }
    },
};