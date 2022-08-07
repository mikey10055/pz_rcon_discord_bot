const fs = require('node:fs');
const path = require('node:path');

const {
    COMMAND_SAVE_ENABLED,
    COMMAND_QUIT_ENABLED,
    COMMAND_SERVERMSG_ENABLED,
    COMMAND_TELEPORT_ENABLED,
    COMMAND_TELEPORTTO_ENABLED,
    COMMAND_PLAYERS_ENABLED,
    COMMAND_SETACCESSLEVEL_ENABLED,
    COMMAND_ADDITEM_ENABLED,
    COMMAND_ADDUSER_ENABLED,
    COMMAND_ADDVEHICLE_ENABLED,
    COMMAND_ADDXP_ENABLED,

    COMMAND_BANID_ENABLED,
    COMMAND_BANUSER_ENABLED,
    COMMAND_CHANGEOPTION_ENABLED,
    COMMAND_CHOPPER_ENABLED,
    COMMAND_CREATEHORDE_ENABLED,
    COMMAND_GODMOD_ENABLED,
    COMMAND_GUNSHOT_ENABLED,
    COMMAND_KICK_ENABLED,
    COMMAND_LIGHTNING_ENABLED,
    COMMAND_REMOVEUSERFROMWHITELIST_ENABLED,
    COMMAND_STARTRAIN_ENABLED,
    COMMAND_STARTSTORM_ENABLED,
    COMMAND_STOPRAIN_ENABLED,
    COMMAND_STOPWEATHER_ENABLED,
    COMMAND_UNBANID_ENABLED,
    COMMAND_UNBANUSER_ENABLED,
    COMMAND_VOICEBAN_ENABLED,
    COMMAND_THUNDER_ENABLED,
    COMMAND_HEAL_ENABLED
} = process.env;

const getCommand = (filename) => {
    const commandsPath = path.join(__dirname, 'commands');
    const filePath = path.join(commandsPath, `${filename}.js`);
    const command = require(filePath);

    return command;
}

const getCommands = () => {
    const commands = [];

    if (COMMAND_SAVE_ENABLED === "true") {
        commands.push(
            getCommand("save")
        );
    }
    
    if (COMMAND_QUIT_ENABLED === "true") {
        commands.push(
            getCommand("quit")
        );
    }

    if (COMMAND_SERVERMSG_ENABLED === "true") {
         commands.push(
             getCommand("servermsg")
         );
    }

    if (COMMAND_TELEPORT_ENABLED === "true") {
        commands.push(
            getCommand("teleport")
        );
    }

    if (COMMAND_TELEPORTTO_ENABLED === "true") {
        commands.push(
            getCommand("teleportto")
        );
    }

    if (COMMAND_PLAYERS_ENABLED === "true") {
        commands.push(
            getCommand("players")
        );
    }

    if (COMMAND_SETACCESSLEVEL_ENABLED === "true") {
        commands.push(
            getCommand("setaccesslevel")
        );
    }
    if (COMMAND_ADDITEM_ENABLED === "true") {
        commands.push(
            getCommand("additem")
        )
    }

    if (COMMAND_ADDUSER_ENABLED === "true") {
        commands.push(
            getCommand("adduser")
        );
    }

    if (COMMAND_ADDVEHICLE_ENABLED === "true") {
        commands.push(
            getCommand("addvehicle")
        )
    } 

    if (COMMAND_ADDXP_ENABLED === "true") {
        commands.push(
            getCommand("addxp")
        );
    }

    if (COMMAND_BANID_ENABLED === "true") {
        commands.push(
            getCommand("banid")
        );
    }
    if (COMMAND_BANUSER_ENABLED === "true") {
        commands.push(
            getCommand("banuser")
        );
    }

    if (COMMAND_CHANGEOPTION_ENABLED === "true") {
        commands.push(
            getCommand("changeoption")
        );
    }

    if (COMMAND_CHOPPER_ENABLED === "true") {
        commands.push(
            getCommand("chopper")
        );
    }

    if (COMMAND_CREATEHORDE_ENABLED === "true") {
        commands.push(
            getCommand("createhorde")
        );
    }

    if (COMMAND_GODMOD_ENABLED === "true") {
        commands.push(
            getCommand("godmod")
        );
    }

    if (COMMAND_GUNSHOT_ENABLED === "true") {
        commands.push(
            getCommand("gunshot")
        );
    }

    if (COMMAND_KICK_ENABLED === "true") {
        commands.push(
            getCommand("kick")
        );
    }

    if (COMMAND_LIGHTNING_ENABLED === "true") {
        commands.push(
            getCommand("lightning")
        );
    }

    if (COMMAND_REMOVEUSERFROMWHITELIST_ENABLED === "true") {
        commands.push(
            getCommand("removeuserfromwhitelist")
        );
    }

    if (COMMAND_STARTRAIN_ENABLED === "true") {
        commands.push(
            getCommand("startrain")
        );
    }

    if (COMMAND_STARTSTORM_ENABLED === "true") {
        commands.push(
            getCommand("startstorm")
        );
    }

    if (COMMAND_STOPRAIN_ENABLED === "true") {
        commands.push(
            getCommand("stoprain")
        );
    }

    if (COMMAND_STOPWEATHER_ENABLED === "true") {
        commands.push(
            getCommand("stopweather")
        );
    }

    if (COMMAND_UNBANID_ENABLED === "true") {
        commands.push(
            getCommand("unbanid")
        );
    }

    if (COMMAND_UNBANUSER_ENABLED === "true") {
        commands.push(
            getCommand("unbanuser")
        );
    }

    if (COMMAND_VOICEBAN_ENABLED === "true") {
        commands.push(
            getCommand("voiceban")
        );
    }

    if (COMMAND_THUNDER_ENABLED === "true") {
        commands.push(
            getCommand("thunder")
        );
    }
    if (COMMAND_HEAL_ENABLED === "true") {
        commands.push(
            getCommand("heal")
        );
    }

    return commands;

}

const setCommand = (client, command) => {

    client.commands.set(command.data.name, command);

}

const setCommands = (client) => {

    const allCommands = getCommands();

    allCommands.forEach(command => setCommand(client, command));

}

module.exports = {
    setCommands,
    getCommands
};