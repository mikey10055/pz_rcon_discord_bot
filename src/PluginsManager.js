const { log } = require("./onstart.js");

const path = require("path");

class PluginsManager {
    constructor(pluginNamesStr) {
        this.pluginNamesStr = pluginNamesStr;
        this.pluginNames = this.pluginNamesStr.split(",").map(str => str.trim()).filter(str => str.length > 0 && str !== undefined);

        this.plugins = [];
    }

    load() {
        for (let index = 0; index < this.pluginNames.length; index++) {
            const pluginName = this.pluginNames[index];
            try {
                const pluginClass = require(path.join("../plugins/", pluginName.trim()) );
                const plugin = new pluginClass();

                plugin.load();
    
                this.plugins.push(plugin);
    
                log(`Loaded ${pluginName.trim()} Plugin`, "PLUGIN")
                
            } catch (error) {
                log(`Failed to load plugin "${pluginName}"`, "PLUGIN");
                log(error);
            }

        }

    }

    discord_ready(client, prcon) {

        for (let index = 0; index < this.plugins.length; index++) {
            const plugin = this.plugins[index];
            plugin.discord_ready(client, prcon);
        }

    }

    discord_interaction(client, prcon, interaction) {
        for (let index = 0; index < this.plugins.length; index++) {
            const plugin = this.plugins[index];
            plugin.discord_interaction(client, prcon, interaction);
        }
    }

    commands() {
        let commandsList = [];
        for (let index = 0; index < this.plugins.length; index++) {
            const plugin = this.plugins[index];
            commandsList.push(...plugin.commands_register());
        }

        return commandsList;
    }

}

module.exports = PluginsManager;
