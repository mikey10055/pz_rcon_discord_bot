# PZ RCON Discord Bot

### Getting started

Requires [Nodejs](https://nodejs.org/)

Once you have nodejs, open a terminal and type
```
npm install
```

Inside the `.env` file you will find the following variables.

```
RCON_HOST="127.0.0.1"
RCON_PORT="27015"
RCON_PASS=""

# Discord bot client id
DISCORD_CLIENT_ID=""

# Discord bot token
DISCORD_TOKEN=""

# Used for registering slash commands to the specified guild
DISCORD_GUILDID=""

#### COMMANDS
# values: true || false
# if "false" commands won't be registered at all on discord.

COMMAND_SAVE_ENABLED="true"
COMMAND_QUIT_ENABLED="true"
COMMAND_SERVERMSG_ENABLED="true"
COMMAND_TELEPORT_ENABLED="true"
COMMAND_PLAYERS_ENABLED="true"
COMMAND_SETACCESSLEVEL_ENABLED="true"
```
`DISCORD_CLIENT_ID` and `DISCORD_TOKEN` can be found after creating a bot [here](https://discord.com/developers/applications)

`DISCORD_GUILDID` is the Id for the server that can be optained once you enable Developer mode for your discord user account. Can be found at `User Settings -> Advanced -> Developer Mode`. Once enabled you can get the `DISCORD_GUILDID` by right clicking on your servers name or image, and clicking `Copy ID`.

Once all variables are set in the .env, inside a terminal type the following
```
npm start
```