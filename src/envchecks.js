const { logToFile } = require("./logging");

const {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
    DISCORD_GUILDID
} = process.env;



const checkEnv = (terminal) => {
    const log = (text) => {
        logToFile(`[ENV][ERROR] ${text}`);
        terminal.log(text);
    }

    const checkVar = (name, displayName) => {
        if (typeof name === "undefined" || name === "") {
            log(`'${displayName}' is missing or invalid`);
            return false;
        }
        return true;
    }

    let valid = true;
    if (!checkVar(DISCORD_TOKEN, "DISCORD_TOKEN")) {
        valid = false;
    }

    if (!checkVar(DISCORD_CLIENT_ID, "DISCORD_CLIENT_ID")) {
        valid = false;
    }

    if (!checkVar(DISCORD_GUILDID, "DISCORD_GUILDID")) {
        valid = false;
    }

    return valid;
}


module.exports = {
    checkEnv
}