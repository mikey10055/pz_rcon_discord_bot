require('dotenv').config();
const wait = require('node:timers/promises').setTimeout;

const readline = require("readline");

const Rcon = require('rcon');
const {
    Client,
    GatewayIntentBits,
    Collection
} = require('discord.js');

const register = require("../src/deployCommands");
const {
    setCommands
} = require("../src/fileCommands");

const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    DISCORD_TOKEN
} = process.env;

let ConnectedToRconServer = false;

let shutdownTimer;
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
    console.log(`> Connected to Discord as ${client.user.tag}!`);
    neline();
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

        console.log(`> Connected to ${RCON_HOST}:${RCON_PORT}`);
        ConnectedToRconServer = true;

        if (lastInteraction) {

            lastInteraction.editReply({
                content: "Connected",
                ephemeral: false
            });

            lastInteraction = null;
        }
        neline();

    })
    .on("connect", () => {
        console.log(`> Connecting to ${RCON_HOST}:${RCON_PORT}...`);
    })
    .on('response', function (str) {
        if (str.length > 0) {
            console.log("Response: " + str);
            neline();
            if (lastInteraction) {
                lastInteraction.editReply(str);

                lastInteraction = null;
            }
        }

    }).on('error', function (err) {
        console.log(err);
        neline();
        if (lastInteraction) {
            lastInteraction.editReply({
                content: "Sorry, could not complete that action.",
                ephemeral: true
            });

            lastInteraction = null;
        }
    }).on('end', function () {
        console.log("> Connection closed");
        ConnectedToRconServer = false;
        clearShutdownTimers(shutdownTimers);
        console.log("> Lost connection to server, type 'exit' to shutdown");

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


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));


const neline = (async () => {
    try {
        const txt = await prompt('> (type "exit" to quit): ');
        if (txt === "exit") {
            process.exit(0);
        } else {
            rconConnection.send(txt);
            neline();
        }
    } catch (e) {
        console.errror("unable to prompt", e)
        neline();
    }
})

//when done reading prompt exit program 
rl.on('close', () => process.exit(0));

(async () => {
    await register();
    client.login(DISCORD_TOKEN);
})();