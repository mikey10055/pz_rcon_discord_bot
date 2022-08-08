const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon, triggerCommand
} = require('../helper');

const cmd = require('../pzcommands');

const { 
    serverRestartUpdateMessage
} = require("../messages/server");

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
    async execute(interaction, rconConnection, timers, log) {
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
                cmd.servermsg(rconConnection, `Server shutting down in ${mins} ${mins != 1 ? "minutes": "minute"}`);
                log(`Shutting down in ${(mins * 60) * 1000}ms`);
                await interaction.editReply({
                    content: `Quitting in ${mins} ${mins != 1 ? "minutes": "minute"}`,
                    ephemeral: false
                });

                timers.setShutdownTimers([
                    ((mins * 60) * 1000) - (60000 * 10) > 0 ? 
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, `Server shutting down in 10 minutes`))
                        }, ((mins * 60) * 1000) - (60000 * 10))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 5) > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, `Server shutting down in 5 minutes`))
                        }, ((mins * 60) * 1000) - (60000 * 5))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 3)  > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, `Server shutting down in 3 minutes`))
                        }, ((mins * 60) * 1000) - (60000 * 3)) 
                    : null,
                    ((mins * 60) * 1000) - 60000 > 0 ?
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, `Server shutting down in 1 minute`))
                        }, ((mins * 60) * 1000) - 60000)
                    : null,
                    ((mins * 60) * 1000) - 30000 > 0 ? 
                        setTimeout(() => {
                            triggerCommand((rcon) => cmd.servermsg(rcon, `Server shutting down in 30 seconds`))
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

                return;
            }

            if (sub === "cancel") {
                if (timers.areTimersActive()) {
                    timers.clearShutdownTimers();

                    cmd.servermsg(rconConnection, "Server shutdown cancelled");
                    log("Cancelled server shutdown");
                    await interaction.editReply({
                        content: "Cancelled server quit"
                    });
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