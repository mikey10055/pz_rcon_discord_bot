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
        ,
    async execute(interaction, rconConnection, timers, log) {
        const msg = interaction.options.getString('message');
        cmd.servermsg(rconConnection, msg);
    },
    async reply(interaction, response) {
        if (response === "Message sent.") {
        const msg = interaction.options.getString('message');

            await interaction.editReply({
                content: `Server message \`${msg}\` sent`,
                ephemeral: false
            });
            return;
        }

        await interaction.editReply({
            content: response,
            ephemeral: false
        });

    }
};