const { now } = require("../src/timestamps");

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
    })
}