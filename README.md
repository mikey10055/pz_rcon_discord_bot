# PZ RCON Discord Bot

## Getting started

Requires [Nodejs](https://nodejs.org/)

Once you have nodejs, open a terminal and type
```
npm install
```

Inside the `.env` file you will need to set the variables.

`DISCORD_CLIENT_ID` and `DISCORD_TOKEN` can be found after creating a bot [here](https://discord.com/developers/applications)

`DISCORD_GUILDID` is the Id for the server that can be optained once you enable Developer mode for your discord user account. Can be found at `User Settings -> Advanced -> Developer Mode`. Once enabled you can get the `DISCORD_GUILDID` by right clicking on your servers name or image, and clicking `Copy ID`.

Once all variables are set in the .env, inside a terminal type the following
```
npm start
```

## Managing permissions

All permissions for the commands are handled by Discord, under the interactions tab in server settings. By default all commands require the user to have the `Administrator` permission.

The interactions for the bot will be under the name of the bot you created.


![interactions image](./.github/interactions.jpg?raw=true)

All of the commands will appear once you have run `npm start`

![slashcommands image](./.github/slashcommands.jpg?raw=true)

## Embeded Messages

All embeded type messages can be configered in `config/messages.js`

## Shutdown Server Messages

Shutdown server messages can be configured in `config/inGameMessages.js`


---

Have any questions? feel free to ask on [Discord](https://discord.gg/b9V4EnfWAx)