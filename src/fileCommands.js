const fs = require('node:fs');
const path = require('node:path');

const {
    COMMAND_SAVE_ENABLED,
    COMMAND_QUIT_ENABLED,
    COMMAND_SERVERMSG_ENABLED,
    COMMAND_TELEPORT_ENABLED,
    COMMAND_TELEPORTTO_ENABLED,
    COMMAND_PLAYERS_ENABLED,
    COMMAND_SETACCESSLEVEL_ENABLED
} = process.env;

const getCommand = (filename) => {
    const commandsPath = path.join(__dirname, 'commands');
    const filePath = path.join(commandsPath, `${filename}.js`);
    const command = require(filePath);

    return command;

}

const getCommands = () => {
    const commands = [];

    commands.push(
        getCommand("connect")
    );

    commands.push(
        getCommand("disconnect")
    )

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