const ServerStatusEnum = require("../src/serverStates");
const { now, minitesText } = require("../src/timestamps");

module.exports = {
    /**
     * Used when the /quit command is complete
     * 
     *  Content is a discord embed
     *  For more info on avalable fields see (https://discord.com/developers/docs/resources/channel#embed-object)
     */
    "ServerRestartUpdateMessage": () => ({
        color: 0x0099ff,
        title: 'Server Restarting',
        description: "Server is restarting and will be back online shortly.",
        timestamp: now()
    }),
    /**
     * Used when rcon server disconnects and then reconnects 
     * 
     *  Content is a discord embed
     *  For more info on avalable fields see (https://discord.com/developers/docs/resources/channel#embed-object)
     */
    "ServerOnline": () => ({
        color: 0x0099ff,
        title: 'Server Online',
        description: "Server is online",
        timestamp: now()
    }),
    /**
     * Used when rcon server disconnects and then reconnects 
     * 
     *  Content is a discord embed
     *  For more info on avalable fields see (https://discord.com/developers/docs/resources/channel#embed-object)
     */
    "DiscordServerQuitting": (time) => ({
        color: 0x0099ff,
        title: 'Server restarting soon:tm:',
        description: `Server will restart in ${minitesText(time)}`,
        timestamp: now()
    }),
    /**
     * Used when rcon server disconnects and then reconnects 
     * 
     *  Content is a discord embed
     *  For more info on avalable fields see (https://discord.com/developers/docs/resources/channel#embed-object)
     */
    "ServerStatus": (status) => {
            let message = "";
            switch (status) {
                case ServerStatusEnum.Offline:
                    /** Offline message */
                    message = ":red_circle: Offline";
                    break;
                case ServerStatusEnum.Online:
                    /** Online message */
                    message = ":green_circle: Online";
                    break;
                case ServerStatusEnum.Restarting:
                    /** Restarting message */
                    message = ":blue_circle: Restarting";
                    break;
                default:
                    break;
            }
            return {
                color: 0x0099ff,
                title: 'Server Status',
                description: message,
                timestamp: now()
            }
    },
    /**
     * For more info see (https://discord.com/developers/docs/resources/channel#message-object-message-structure)
     */
    "MessageCommand": (message, users) => ({
        content: users,
        embeds: [{
            color: 0x0099ff,
            title: 'Server message',
            description: message,
            timestamp: now()
        }]
    })
        
}