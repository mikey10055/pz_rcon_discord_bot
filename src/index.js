require('dotenv').config();

const readline = require("readline");

const Rcon = require('rcon');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const register = require("../src/deployCommands");
const { setCommands } = require("../src/fileCommands");
const { replyToInteraction } = require('./helper');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const log = (data) => {
    newLine();
    console.log(data);
    newLine();
}

const newLine = (async () => {
    try {
        const txt = await prompt(`>: `);
        if (txt === "exit") {
            process.exit(0);
        } else if (txt === "connect") {
            if (!rconConnection.hasAuthed) {
                rconConnection.connect();
            } else {
                log("Already connected");
            }
            newLine();
        } else if (txt === "disconnect") {
            if (rconConnection.hasAuthed) {
                rconConnection.disconnect();
            } else {
                log("Not connected");
            }
            newLine();
        } else {
            rconConnection.send(txt);
            newLine();
        }
    } catch (e) {
        console.error("unable to prompt", e)
        newline();
    }
});

rl.on('close', () => process.exit(0));

const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    DISCORD_TOKEN
} = process.env;

let shutdownTimers = [];

const setShutdownTimers = (timers) => {
    shutdownTimers = timers;
}

const clearShutdownTimers = () => {
    shutdownTimers.forEach(t => clearTimeout(t));
    shutdownTimers = [];
}

const client = new Client({
    intents: Object.values(GatewayIntentBits)
});

client.commands = new Collection();
setCommands(client);

const rconConnection = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS);

client.on('ready', () => {
    log(`Connected to Discord as ${client.user.tag}!`);

    rconConnection.connect();
});


    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            const enteredOptions = interaction.options._hoistedOptions.map(op => `${op.name}:${op.value}`).join(" ");
            log(
                `[Discord]: ${interaction.member.user.tag} executed /${interaction.commandName} ${enteredOptions}`
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
                }, log);
            });
            rc.on("response", async (response) => {
                if (response.length > 0) {
                    log(`[RCON Response]: ${response}`);
                    if (command.reply) {
                        command.reply(interaction, response);
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
                log(`[RCON Error]: ${err.code}`);
                if (err.code === "ECONNREFUSED") {
                    replyToInteraction(interaction, {
                        content: "Server connection refused, please make sure the server is avaliable."
                    });
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
            console.log(error);
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: false
            });
        }

    });

rconConnection.on('auth', function () {

        log(`Connected to ${RCON_HOST}:${RCON_PORT}`);
        log("Extra commands: connect, disconnect, exit ( shuts down the bot ) ");
    })
    .on("connect", () => {
        log(`Connecting to ${RCON_HOST}:${RCON_PORT}...`);
    })
    .on("server", (str) => {
        if (str.length > 0) {
            log("[Rcon Server]: " + str);
        }
    })
    .on('response', function (str) {
        if (str.length > 0) {
            log("[Rcon Response]: " + str);
        }

    }).on('error', function (err) {
        log(`[Rcon Error]: ${err.code}`);

        if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
            rconConnection.disconnect();
        }

    }).on('end', function () {
        log("Connection closed");
        log("Lost connection to server, type 'exit' to shutdown");
    });

(async () => {
    await register();
    client.login(DISCORD_TOKEN);
})();