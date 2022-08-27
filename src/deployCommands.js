const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { getCommands } = require('./fileCommands');
const { logToFile } = require('./logging');
const { log } = require('./onstart');

const {
    DISCORD_CLIENT_ID,
    DISCORD_TOKEN,
    DISCORD_GUILDID
} = process.env;


const commandList = getCommands();

const commands = commandList.map(cmd => cmd.data.toJSON());

const rest = new REST({
    version: '10'
}).setToken(DISCORD_TOKEN);

const register = (async () => {
    try {
        log('Started refreshing application (/) commands.');
        logToFile(`Adding commands: [${commands.map(c => c.name).join(", ")}]`)

        await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILDID), {
            body: commands
        });
        logToFile("Commands Added Successfully")
        log('Successfully reloaded application (/) commands.');
    } catch (error) {
        log(error);
        logToFile(error);
    }
});

module.exports = register;