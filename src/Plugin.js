const { log } = require("./onstart.js");

const path = require("path");

class BotPlugin {
    constructor(pluginPath) {
        this.pluginPath = pluginPath || "";
    }

    getCommand(filename) {
        const commandsPath = path.join(this.pluginPath, 'commands');
        const filePath = path.join(commandsPath, `${filename}.js`);
        const command = require(filePath);
        return command;
    }

    load() {}
    // discord client "ready" event
    discord_ready(client, prcon) {}
    // discord client "integration" event
    discord_interaction(client, prcon, interaction) {}

    // get and add all commands to an array;
    commands_register() {
        return [];
    }

}

module.exports = BotPlugin;
