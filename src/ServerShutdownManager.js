const inGameMsg = require("../config/inGameMessages.js");
const { triggerCommand } = require("./helper.js");
const { log } = require("./onstart.js");
const cmd = require("./pzcommands.js");
const { ServerStatusEnum } = require("./serverStates.js");

class ServerShutdownManager {
    constructor() {
        this.timers = [];
        this.serverRestartPending = ServerStatusEnum.Offline;
    }

    setShutdownTimers(timers) {
        this.timers = timers;
    }

    clearShutdownTimers() {
        this.timers.forEach(t => clearTimeout(t));
        this.timers = [];
    }

    areTimersActive() {
        const res = this.timers.filter(t => t !== undefined || t !== null).length > 0;
        return res;
    }

    setRestartPending(status) {
        this.serverRestartPending = status;
    }

    shutdownIn(mins, onLast=()=>{}, onAlreadyShuttingDown=()=>{}) {

        if (this.areTimersActive()) {
            onAlreadyShuttingDown();
            return
        }

        const minsText = `${mins} ${mins != 1 ? "minutes" : "minute"}`;
        const msg = inGameMsg.quit.intitalMessage.replace("{x}", minsText);
        triggerCommand((rcon) => cmd.servermsg(rcon, msg));
        log(msg, "InGame");
        log(`Shutting down in ${(mins * 60) * 1000}ms`);

        this.setRestartPending(ServerStatusEnum.Restarting);
        this.setShutdownTimers([
            ((mins * 60) * 1000) - (60000 * 10) > 0 ?
                setTimeout(() => {
                    triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning10m))
                    log(inGameMsg.quit.warning10m, "InGame")
                }, ((mins * 60) * 1000) - (60000 * 10))
                : null,
            ((mins * 60) * 1000) - (60000 * 5) > 0 ?
                setTimeout(() => {
                    triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning5m))
                    log(inGameMsg.quit.warning5m, "InGame")
                }, ((mins * 60) * 1000) - (60000 * 5))
                : null,
            ((mins * 60) * 1000) - (60000 * 3) > 0 ?
                setTimeout(() => {
                    triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning3m))
                    log(inGameMsg.quit.warning3m, "InGame")
                }, ((mins * 60) * 1000) - (60000 * 3))
                : null,
            ((mins * 60) * 1000) - 60000 > 0 ?
                setTimeout(() => {
                    triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning1m))
                    log(inGameMsg.quit.warning1m, "InGame")
                }, ((mins * 60) * 1000) - 60000)
                : null,
            ((mins * 60) * 1000) - 30000 > 0 ?
                setTimeout(() => {
                    triggerCommand((rcon) => cmd.servermsg(rcon, inGameMsg.quit.warning30s))
                    log(inGameMsg.quit.warning30s, "InGame")
                }, ((mins * 60) * 1000) - 30000)
                : null,
            setTimeout(async () => {
                triggerCommand((rcon) => { cmd.quit(rcon); });
                log("Server Quit Triggered", "QUIT");
                this.clearShutdownTimers();
                this.setRestartPending(ServerStatusEnum.Online);
                onLast();
            }, (mins * 60) * 1000)
        ]);
    }

}

module.exports = {
    ServerShutdownManager,
    MainServerShutdownManager: new ServerShutdownManager()
};
