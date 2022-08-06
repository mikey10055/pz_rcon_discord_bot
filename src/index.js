require('dotenv').config();

const readline = require("readline");

const Rcon = require('rcon');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

const register = require("../src/deployCommands");
const { setCommands } = require("../src/fileCommands");

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
        const txt = await prompt('>: ');
        if (txt === "exit") {
            process.exit(0);
        } else if (txt === "connect") {
            rconConnection.connect();
            newLine();
        } else if (txt === "disconnect") {
            rconConnection.disconnect();
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

let ConnectedToRconServer = false;

let shutdownTimers = [];

const setShutdownTimers = (timers) => {
    shutdownTimers = timers;
}

const clearShutdownTimers = () => {
    shutdownTimers.forEach(t => clearTimeout(t));
    shutdownTimers = [];
}

let lastInteraction;

const setLastInteraction = (inter) => {
    lastInteraction = inter;
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
        await command.execute(interaction, ConnectedToRconServer, rconConnection, setLastInteraction, {
            timers: shutdownTimers,
            setShutdownTimers,
            clearShutdownTimers,
            areTimersActive: () => {
                const res = shutdownTimers.filter(t => t !== undefined || t !== null).length > 0;
                return res;
            }
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }

});

rconConnection.on('auth', function () {

        log(`Connected to ${RCON_HOST}:${RCON_PORT}`);
        log("(type exit to quit)");
        ConnectedToRconServer = true;

        if (lastInteraction) {

            lastInteraction.editReply({
                content: "Connected",
                ephemeral: false
            });

            lastInteraction = null;
        }
        
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
            
            if (lastInteraction) {
                lastInteraction.editReply(str);

                lastInteraction = null;
            }
        }

    }).on('error', function (err) {
        log(`[Rcon Error]: ${err.code}`);
        
        if (lastInteraction) {
            lastInteraction.editReply({
                content: "Sorry, could not complete that action.",
                ephemeral: true
            });

            lastInteraction = null;
        }
    }).on('end', function () {
        log("Connection closed");
        ConnectedToRconServer = false;
        clearShutdownTimers(shutdownTimers);
        log("Lost connection to server, type 'exit' to shutdown");

        if (lastInteraction) {

            if (lastInteraction.commandName === "disconnect") {
                lastInteraction.editReply({
                    content: "Disconnected from server",
                    ephemeral: true
                });
                return;
            }

            lastInteraction = null;
        }

    });

(async () => {
    await register();
    client.login(DISCORD_TOKEN);
})();