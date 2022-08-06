const {
    SlashCommandBuilder
} = require('discord.js');
const {
    notConnectedToRcon
} = require('../helper');

const cmd = require('../pzcommands');


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
    async execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction, timers) {
        if (!ConnectedToRconServer) {
            notConnectedToRcon(interaction);
        } else {
            const sub = interaction.options.getSubcommand();
            if (sub === "in") {
                if (timers.areTimersActive()) {
                    await interaction.reply({
                        content: 'Already shutting down',
                        ephemeral: false
                    });
                    return;
                }

                const mins = interaction.options.getNumber('minutes');
                cmd.servermsg(rconConnection, `Server shutting down in ${mins} ${mins != 1 ? "minutes": "minute"}`);
                console.log(`Shutting down in ${(mins * 60) * 1000}ms`);
                await interaction.reply({
                    content: `Quitting in ${mins} ${mins != 1 ? "minutes": "minute"}`,
                    ephemeral: false
                });

                timers.setShutdownTimers([
                    ((mins * 60) * 1000) - (60000 * 10) > 0 ? 
                        setTimeout(() => {
                            cmd.servermsg(rconConnection, `Server shutting down in 10 minutes`);
                        }, ((mins * 60) * 1000) - (60000 * 10))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 5) > 0 ?
                        setTimeout(() => {
                            cmd.servermsg(rconConnection, `Server shutting down in 5 minutes`);
                        }, ((mins * 60) * 1000) - (60000 * 5))
                    : null,
                    ((mins * 60) * 1000) - (60000 * 3)  > 0 ?
                        setTimeout(() => {
                            cmd.servermsg(rconConnection, `Server shutting down in 3 minutes`);
                        }, ((mins * 60) * 1000) - (60000 * 3)) 
                    : null,
                    ((mins * 60) * 1000) - 60000 > 0 ?
                        setTimeout(() => {
                            cmd.servermsg(rconConnection, `Server shutting down in 1 minute`);
                        }, ((mins * 60) * 1000) - 60000)
                    : null,
                    ((mins * 60) * 1000) - 30000 > 0 ? 
                        setTimeout(() => {
                            cmd.servermsg(rconConnection, `Server shutting down in 30 seconds`);
                        }, ((mins * 60) * 1000) - 30000)
                    : null,
                    setTimeout(async () => {
                        cmd.quit(rconConnection);
                        await interaction.followUp({
                            content: 'Quitting',
                            ephemeral: false
                        });
                        timers.clearShutdownTimers();
                    }, (mins * 60) * 1000)
                ]);

                return;
            }

            if (sub === "now") {
                timers.clearShutdownTimers();
                cmd.quit(rconConnection);
                await interaction.reply({
                    content: 'Quitting',
                    ephemeral: false
                });

                return;
            }

            if (sub === "cancel") {
                if (timers.areTimersActive()) {
                    timers.clearShutdownTimers();

                    cmd.servermsg(rconConnection, "Server shutdown cancelled");
                    console.log("Cancelled server shutdown");
                    await interaction.reply({
                        content: "Cancelled server quit"
                    });
                } else {
                    await interaction.reply({
                        content: "Nothing to cancel.",
                        ephemeral: true
                    });
                }

                return;
            }
        }
    },
};