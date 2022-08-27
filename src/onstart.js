const { checkEnv } = require("./envchecks");
const { logToFile } = require("./logging");
const RconTerminal = require("./terminal");

const terminal = new RconTerminal();

terminal.init();

const log = (text, type) => {

    const extra = type ? `[${type}] ` : "";
    terminal.log(text);
    logToFile(`${extra}${text}`);
}

process.on('exit', () => {
    console.log("Exiting");
});

if (!checkEnv(terminal)) {
    log("Invalid values in .env file. see above for more details");
    process.exit();
}

module.exports = {
    terminal, 
    log
}