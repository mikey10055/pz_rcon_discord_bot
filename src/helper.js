const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    COMMANDS_AUTOCOMPLETION_ON
} = process.env;

const Rcon = require('rcon');
const { logToFile } = require('./logging');

const hasRole = (member, role) => member.roles.cache.has(role);

const notConnectedToRcon = async (interaction) => {
    await interaction.reply({
        content: "Dosen't seem to be connected to server, try /connect",
        ephemeral: true
    });
}

const replyToInteraction = async (interaction, data) => {
    if (interaction.deferred) {
        interaction.editReply(data);
    } else {
        interaction.reply(data);
    }
}

const triggerCommand = (command) => {
    const rconConnection = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS, {
        id: "505055"
    });
    rconConnection.on('auth', function () {
            command(rconConnection);
            logToFile(`[RCON Auth][${rconConnection.rconId}][triggerCommand]: auth`)
        })
        .on("connect", () => {
            logToFile(`[RCON Connect][${rconConnection.rconId}][triggerCommand]: connect`)
        })
        .on("server", (str) => {
            logToFile(`[RCON Server][${rconConnection.rconId}][triggerCommand]: ${str}`)
        })
        .on('response', function (str) {
            if (str.length > 0) {
                logToFile(`[RCON Response][${rconConnection.rconId}][triggerCommand]: ${str}`)
                rconConnection.disconnect();
            }
        }).on('error', function (err) {
            logToFile(`[Rcon Error][${rconConnection.rconId}][triggerCommand]: ${err.code}`);

            if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
                rconConnection.disconnect();
            }

        }).on('end', function () {
            logToFile(`[RCON Response][${rconConnection.rconId}][triggerCommand]: End`)
        });

        rconConnection.connect();
}

const rconCommand = (command) => {
    return new Promise((resolve, reject) => {
        const rconConnection = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS, {
            id: "808088"
        });
        rconConnection.on('auth', function () {
                command(rconConnection);
                logToFile(`[RCON Auth][${rconConnection.rconId}][rconCommand]: auth`)
            })
            .on("connect", () => {
                logToFile(`[RCON Connect][${rconConnection.rconId}][rconCommand]: connect`)
            })
            .on("server", (str) => {
                logToFile(`[RCON Server][${rconConnection.rconId}][rconCommand]: ${str}`)
            })
            .on('response', function (str) {
                if (str.length > 0) {
                    rconConnection.disconnect();
                    logToFile(`[RCON Response][${rconConnection.rconId}][rconCommand]: ${str}`)
                    resolve(str)
                }
            }).on('error', function (err) {
                logToFile(`[Rcon Error][${rconConnection.rconId}][rconCommand]: ${err.code} rconCommand`);
    
                if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
                    rconConnection.disconnect();
                }
                
                reject(err.code)
            }).on('end', function () {
                logToFile(`[RCON End][${rconConnection.rconId}][rconCommand]: End`)

            });
    
        rconConnection.connect();
    })
}


const isAutoCompleteOn = () => {
    return COMMANDS_AUTOCOMPLETION_ON === "true"
}

module.exports = {
    hasRole,
    notConnectedToRcon,
    replyToInteraction,
    triggerCommand,
    rconCommand,
    isAutoCompleteOn
}