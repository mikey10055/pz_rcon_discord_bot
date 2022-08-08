const {
    ServerRestartUpdateMessage,
    ServerOnline
} = require("../../config/messages.js");

const {
    DISCORD_SERVERSTATUS_CHANNELID
} = process.env;

const serverRestartUpdateMessage = (client) => {
    const message = ServerRestartUpdateMessage;
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
            embeds: [message]
        });
    }
}

const serverOnlineMessage = (client) => {
    const message = ServerOnline;
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
            embeds: [message]
        });
    }
}

module.exports = {
    serverRestartUpdateMessage,
    serverOnlineMessage
}