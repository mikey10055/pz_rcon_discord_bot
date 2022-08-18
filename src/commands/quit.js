const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon, triggerCommand
} = require('../helper');

const cmd = require('../pzcommands');

const { 
    serverRestartUpdateMessage, discordServerDisconnectingMessage
} = require("../messages/server");

const inGameMsg = require("../../config/inGameMessages");
const ServerStatusEnum = require('../serverStates');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quit")
        .setDescription("Save and quit the server.")
        .addSubcommand(sub => sub
            .setName("now")
            .setDescription("Save and quit immediately")
        )
        .addSubcommand(sub => sub
            .setName("in")
            .setDescription("Save and quit in `x` minutes.")
            .addNumberOption(option => option.setName("minutes").setDescription("How long in minites until the server saves and quits").setRequired(true))
        )
        .addSubcommand(sub => sub
            .setName("cancel")
            .setDescription("Cancel save and quit.")
        )
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log, isRestarting, restartConnectionNow) {
            const sub = interaction.options.getSubcommand();
            if (sub === "in") {
                if (timers.areTimersActive()) {
                    await interaction.editReply({
                        content: 'Already shutting down',
                        ephemeral: false
                    });
                    return;
                }

                const mins = interaction.options.getNumber('minutes');
                const minsText = `${mins} ${mins != 1 ? "minutes": "minute"}`;
                const msg = inGameMsg.quit.intitalMessage.replace("{x}", minsText);
                triggerCommand((rcon) => cmd.servermsg(rcon, msg));
                log(`Shutting down in ${(mins * 60) * 1000}ms`);
                await interaction.editReply({
                    content: `Quitting in ${mins} ${mins != 1 ? "minutes": "minute"}`,
                    ephemeral: false
                });

                discordServerDisconnectingMessage(interaction.client, mins);

                isRestarting.setRestartPending(ServerStatusEnum.Restarting);

                timers.setShutdownTimers([
                    ((mins * 60) * 1000) - (60000 * 10) > 0 ? 
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning10m))
                        }, ((mins * 60) * 1000) - (60000 * 10))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 5) > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning5m))
                        }, ((mins * 60) * 1000) - (60000 * 5))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 3)  > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning3m))
                        }, ((mins * 60) * 1000) - (60000 * 3)) 
                    : null,
                    ((mins * 60) * 1000) - 60000 > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning1m))
                        }, ((mins * 60) * 1000) - 60000)
                    : null,
                    ((mins * 60) * 1000) - 30000 > 0 ? 
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning30s))
                        }, ((mins * 60) * 1000) - 30000)
                    : null,
                    setTimeout(async () => {
                        triggerCommand((rcon) => { cmd.quit(rcon); });
                        await interaction.followUp({
                            content: 'Quitting',
                            ephemeral: false
                        });
                        serverRestartUpdateMessage(interaction.client);
                        timers.clearShutdownTimers();
                        isRestarting.setRestartPending(ServerStatusEnum.Online);
                        restartConnectionNow();
                    }, (mins * 60) * 1000)
                ]);

                return;
            }

            if (sub === "now") {
                timers.clearShutdownTimers();
                cmd.quit(rconConnection);
                await interaction.editReply({
                    content: 'Quitting',
                    ephemeral: false
                });

                serverRestartUpdateMessage(interaction.client);
                restartConnectionNow();
                return;
            }

            if (sub === "cancel") {
                if (timers.areTimersActive()) {
                    timers.clearShutdownTimers();

                    cmd.servermsg(rconConnection, inGameMsg.quit.canceled);

                    log("Cancelled server shutdown");
                    await interaction.editReply({
                        content: "Cancelled server quit"
                    });

                    isRestarting.setRestartPending(ServerStatusEnum.Online);

                } else {
                    await interaction.editReply({
                        content: "Nothing to cancel.",
                        ephemeral: true
                    });
                }

                return;
            }
    },
};