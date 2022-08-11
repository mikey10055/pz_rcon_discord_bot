const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    COMMANDS_AUTOCOMPLETION_ON
} = process.env;

const Rcon = require('rcon');

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
    const rconConnection = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS);
    rconConnection.on('auth', function () {
            command(rconConnection);
        })
        .on("connect", () => {

        })
        .on("server", (str) => {

        })
        .on('response', function (str) {
            if (str.length > 0) {
                console.log(`>: [RCON Response]: ${str}`)
                rconConnection.disconnect();
            }
        }).on('error', function (err) {
            console.log(`[Rcon Error]: ${err.code}`);

            if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
                rconConnection.disconnect();
            }

        }).on('end', function () {
            
        });

        rconConnection.connect();
}

const rconCommand = (command) => {
    return new Promise((resolve, reject) => {
        const rconConnection = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS);
        rconConnection.on('auth', function () {
                command(rconConnection);
            })
            .on("connect", () => {
    
            })
            .on("server", (str) => {
    
            })
            .on('response', function (str) {
                if (str.length > 0) {
                    rconConnection.disconnect();
                    console.log(`[RCON Response]: ${str}`)
                    resolve(str)
                }
            }).on('error', function (err) {
                console.log(`[Rcon Error]: ${err.code}`);
    
                if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT") {
                    rconConnection.disconnect();
                }
                
                reject(err.code)
            }).on('end', function () {

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