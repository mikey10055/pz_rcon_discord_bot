const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon, triggerCommand
} = require('../helper');

const cmd = require('../pzcommands');

const { 
    discordServerDisconnectingMessage
} = require("../messages/server");

const inGameMsg = require("../../config/inGameMessages");
const {ServerStatusEnum} = require('../serverStates');
const uiText = require('../../config/ui.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription(uiText.commands.quit.description)
        .addSubcommand(sub => sub
            .setName("now")
            .setDescription(uiText.commands.quit.now.description)
        )
        .addSubcommand(sub => sub
            .setName("in")
            .setDescription(uiText.commands.quit.in.description)
            .addNumberOption(option => option.setName("minutes").setDescription(uiText.commands.quit.in.timeOptionDescription).setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("cancel")
            .setDescription(uiText.commands.quit.cancel.description)
        )
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log, isRestarting, restartConnectionNow) {
            const sub = interaction.options.getSubcommand();
            if (sub === "in") {
                if (timers.areTimersActive()) {
                    await interaction.editReply({
                        content: uiText.commands.AlreadyShuttingDown,
                        ephemeral: false
                    });
                    return;
                }

                await interaction.editReply({
                    content: uiText.commands.quit.in.reply(mins),
                    ephemeral: false
                });

                discordServerDisconnectingMessage(interaction.client, mins);

                timers.shutdownIn(mins, async () => {
                    restartConnectionNow();
                    await interaction.followUp({
                        content: uiText.commands.Quitting,
                        ephemeral: false
                    });
                });

                return;
            }

            if (sub === "now") {
                timers.clearShutdownTimers();
                cmd.quit(rconConnection);
                restartConnectionNow();
                await interaction.editReply({
                    content: uiText.commands.Quitting,
                    ephemeral: false
                });
                return;
            }

            if (sub === "cancel") {
                if (timers.areTimersActive()) {
                    timers.clearShutdownTimers();

                    cmd.servermsg(rconConnection, inGameMsg.quit.canceled);

                    log("Cancelled server shutdown");
                    await interaction.editReply({
                        content: uiText.commands.CancelledShutdown
                    });

                    isRestarting.setRestartPending(ServerStatusEnum.Online);

                } else {
                    await interaction.editReply({
                        content: uiText.commands.NothingToCancel,
                        ephemeral: true
                    });
                }

                return;
            }
    },
};