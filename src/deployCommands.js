const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { getCommands } = require('./fileCommands');

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
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILDID), {
            body: commands
        });

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

module.exports = register;