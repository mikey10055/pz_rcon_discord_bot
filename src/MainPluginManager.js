const PluginsManager = require("./PluginsManager.js");

const {
    LOADED_PLUGINS
} = process.env;


let PluginManager = new PluginsManager(LOADED_PLUGINS);

PluginManager.load();

module.exports = PluginManager;
