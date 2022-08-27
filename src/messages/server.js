const {
    ServerRestartUpdateMessage,
    ServerOnline,
    DiscordServerQuitting,
    MessageCommand,
    DailyRestartMessage,
    DailyWarningRestartMessage,
} = require("../../config/messages.js");

const {
    DISCORD_SERVERSTATUS_CHANNELID
} = process.env;

const serverRestartUpdateMessage = (client) => {
    const message = ServerRestartUpdateMessage();
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
            embeds: [message]
        });
    }
}

const serverOnlineMessage = (client) => {
    const message = ServerOnline();
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
            embeds: [message]
        });
    }
}

const discordServerDisconnectingMessage = (client, time) => {
    const message = DiscordServerQuitting(time);
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
            embeds: [message]
        });
    }
}

const messageCommandMessage = (interaction) => {
    
    const message = interaction.options.getString("message");
    const user1 = interaction.options.getMentionable("user1");
    const user2 = interaction.options.getMentionable("user2");
    const user3 = interaction.options.getMentionable("user3");
    const user4 = interaction.options.getMentionable("user4");
    const user5 = interaction.options.getMentionable("user5");
    const users = `${user1 ? `${user1} ` : ""}${user2 ? `${user2} ` : ""}${user3 ? `${user3} ` : ""}${user4 ? `${user4} ` : ""}${user5 ? `${user5} ` : ""}`;
    const fmessage = MessageCommand(message, users);
    
    if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
        interaction.client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send(fmessage);
    }
}

module.exports = {
    serverRestartUpdateMessage,
    serverOnlineMessage,
    discordServerDisconnectingMessage,
    messageCommandMessage
}