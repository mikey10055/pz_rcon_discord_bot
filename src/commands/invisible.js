const {
    SlashCommandBuilder
} = require('discord.js');
const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("invisible")
        .setDescription("Make a player invisible to zombies.")
        .addStringOption(option => option.setName("player").setDescription("Player to set invisible").setRequired(true))
        .addBooleanOption(option => option.setName("enabled").setDescription("Invisible enabled or disabled").setRequired(true))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        const enabled = interaction.options.getBoolean("enabled");
        cmd.invisible(rconConnection, player, enabled);

        // rcon command `invisible` dosen't seem to respond with anything on a success
        setTimeout(() => {
            if (!interaction.replied) {
                interaction.editReply({
                    content: `${player} ${enabled ? "is now" : "is not"} invisible`
                })
            } else {
                console.log("already replyed")
            }
        }, 1500);

    },
};