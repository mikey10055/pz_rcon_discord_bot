const {
    SlashCommandBuilder
} = require('discord.js');
const {
    triggerCommand
} = require("../helper");

const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("heal")
        .setDescription("Heals a player.")
        .addStringOption(option => option.setName("player").setDescription("Player to enable/disable").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        cmd.godmod(rconConnection, player, true);
    },
    async reply(interaction) {
        const player = interaction.options.getString("player");
        triggerCommand((rcon) => {
            cmd.godmod(rcon, player, false);
        })
        await interaction.editReply({
            content: `${player} has been healed`
        });
    }
};