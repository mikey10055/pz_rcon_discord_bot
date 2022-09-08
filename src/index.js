require('dotenv').config();
const { log, terminal } = require('./onstart');

const Rcon = require('rcon');
const {
    Client,
    GatewayIntentBits,
    Collection,
    InteractionType
} = require('discord.js');

const register = require("../src/deployCommands");
const { setCommands } = require("../src/fileCommands");
const { replyToInteraction } = require('./helper');

const {
    serverOnlineMessage, serverRestartUpdateMessage
} = require("./messages/server");
const {ServerStatusEnum, RconState} = require('./serverStates');
const { PersistentRconConnection } = require('./persistentRconConnection');

const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    DISCORD_TOKEN,
    DISCORD_SERVERSTATUS_CHANNELID,
    COMMANDS_REFRESH_ON_START
    
} = process.env;

let serverRestartPending = ServerStatusEnum.Offline;
let setRestartPending = (status) => {
    serverRestartPending = status
}

let shutdownTimers = [];

const setShutdownTimers = (timers) => {
    shutdownTimers = timers;
}

const clearShutdownTimers = () => {
    shutdownTimers.forEach(t => clearTimeout(t));
    shutdownTimers = [];
}

const client = new Client({
    intents: [GatewayIntentBits.GuildIntegrations]
});

client.commands = new Collection();
setCommands(client);

const prcon = new PersistentRconConnection();

prcon.on("connect", (e) => {
    log("Connected to server", "MAIN");
});

prcon.on("reconnecting", ({attempt, maxAttempts}) => {
    log(`[${attempt}/${maxAttempts}] attepting to reconnect to server`, "MAIN");
});

prcon.on("maxattemptsreached", () => {
    log("Max reconnect attempts reached, type connect to try reconnect", "MAIN");
})

prcon.on("alreadyconnected", () => {
    log("Already connected", "MAIN");
})

client.on('ready', async () => {
    log(`Connected to Discord as ${client.user.tag}!`, "MAIN");
    try {
        const channel = await client.channels.fetch(DISCORD_SERVERSTATUS_CHANNELID);
        log(`Using ${channel.name} as status channel`, "MAIN");
        
    } catch (error) {
        log("No status channel set", "MAIN");
    }

    prcon.on("close", (e) => {
        serverRestartUpdateMessage(client);
        log("Disconnected from server", "MAIN");
    });

    prcon.on("reconnect", () => {
        log("Reconnected to server", "MAIN");
        serverOnlineMessage(client);
    })

});


    client.on('interactionCreate', async interaction => {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            if (command.autocomplete) {
                command.autocomplete(interaction)
            }
            return;
        };

        if (!interaction.isChatInputCommand()) return;

        try {
            const enteredOptions = interaction.options._hoistedOptions.map(op => `${op.name}:${op.value}`).join(" ");
            const sub = interaction.options.getSubcommand(false);
            log(
                `[Discord]: ${interaction.member.user.tag} executed /${interaction.commandName}${sub ? " " + sub : ""} ${enteredOptions}`,
                "MAIN"
            );
            if (command.beforeExecute) {
                command.beforeExecute(interaction);
            } else {
                await interaction.deferReply({
                    ephemeral: false
                });
            }
            const rc = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS);
            rc.on("auth", async () => {

                await command.execute(interaction, rc, {
                    timers: shutdownTimers,
                    setShutdownTimers,
                    clearShutdownTimers,
                    areTimersActive: () => {
                        const res = shutdownTimers.filter(t => t !== undefined || t !== null).length > 0;
                        return res;
                    }
                }, log, {
                    serverRestartPending,
                    setRestartPending
                }, () => { prcon.disconnect() });
                rc.disconnect();
            });
            rc.on("response", async (response) => {
                if (response.length > 0) {
                    log(`[RCON Response]: ${response}`, "MAIN");
                    if (command.reply) {
                        command.reply(interaction, response, {
                            serverRestartPending,
                            setRestartPending
                        });
                        rc.disconnect();
                        return;
                    } 
                    await interaction.editReply({
                        content: response,
                        ephemeral: false
                    });

                    rc.disconnect();
                }
            });
            rc.on("error", (err) => {
                log(`[RCON Error]: ${err.code}`, "MAIN");
                if (err.code === "ECONNREFUSED") {
                    if (command.notConnected) {
                        command.notConnected(interaction)
                    } else {
                        replyToInteraction(interaction, {
                            content: "Server connection refused, please make sure the server is avaliable."
                        });
                    }
                    rc.disconnect();
                    return;
                }
                replyToInteraction(interaction, {
                    content: "Sorry, could not complete that acton",
                    ephemeral: false
                });
                rc.disconnect();
            })

            rc.connect();

        } catch (error) {
            log(error, "MAIN");
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: false
            });
        }

    });

(async () => {
    terminal.addCommand({
        name: "connect",
        fn: async () => {
            try {
                if (prcon.state === RconState.NotConnected) {
                    await prcon.start();
                } else {
                    log("Already connected", "MAIN");
                }
            } catch (err) {
                log(`[Application][Error] ${JSON.stringify(err)}`, "MAIN");
            }
        }
    });

    terminal.addCommand({
        name: "status",
        fn: async () => {
            log(prcon.getCurrentState(), "STATUS");
        }
    });

    terminal.addCommand({
        name: "disconnect",
        fn: async () => {
            prcon.disconnect();
        }
    });

    try {
        if (COMMANDS_REFRESH_ON_START === "true") {
            await register();
        }
        client.login(DISCORD_TOKEN);
        await prcon.start();
        
    } catch (err) {
        log(`[Application][Error] ${JSON.stringify(err)}`, "MAIN");
    }

})();