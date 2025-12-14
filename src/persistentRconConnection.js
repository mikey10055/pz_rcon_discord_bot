const Rcon = require("rcon");
const { logToFile } = require("./logging");
const cmd = require("./pzcommands");
const { RconState } = require("./serverStates");

const {
    RCON_HOST,
    RCON_PORT,
    RCON_PASS,
    RCON_AUTORECONNECT,
    RCON_AUTORECONNECT_WAIT,
    RCON_AUTORECONNECT_INTERVAL,
    RCON_MAX_AUTORECONNECT_ATTEMPTS,
} = process.env;

class PersistentRconConnection {
    rcon;
    state = RconState.NotConnected;
    _events = {};
    reconnectTimer;
    connectTimer;
    disconnectTimer;
    maxReconnectAttempts = parseInt(RCON_MAX_AUTORECONNECT_ATTEMPTS) ?? 10;
    reconnectAttempts = 0;

    clog(text, type) {
        let id = this.rcon ? this.rcon.rconId ?? "--" : "--";
        logToFile(`[PersistentRconConnection][${id}]${type ? "["+type+"]" : ""} ${text}`);
    }

    on(eventName, fn) {
        if (!this._events.hasOwnProperty(eventName)) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(fn);

    }

    removeEventListener(eventName, fn) {
        let evntData = this._events[eventName];
        if (typeof evntData !== "undefined" && typeof evntData !== "function") {
            const indx = evntData.indexOf(fn);
            evntData.splice(indx, 1);
            return;
        }
        this.clog(`Tried to remove event listener ${evt} but none found`, "PL");
    }

    getStateName(state) {
        return Object.keys(RconState).find(key => RconState[key] === state);
    }

    getCurrentState() {
        return this.getStateName(this.state);
    }

    setState(newState) {
        this.state = newState;
        const statename = this.getStateName(newState);
        this.clog(`${statename} (${newState})`, "STATECHANGE");
    }
    
    removeRconEventListener(evt, fn) {
        let evntData = this.rcon._events[evt];
        if (typeof evntData !== "undefined" && typeof evntData !== "function") {
            const indx = evntData.indexOf(fn);
            evntData.splice(indx, 1);
            return;
        }
        this.clog(`Tried to remove event listener ${evt} but none found`, "RL");
    }

    start() {
        if (this.state === RconState.NotConnected) {
            this.setState(RconState.Connecting);

            this.rcon = new Rcon(RCON_HOST, RCON_PORT, RCON_PASS, {
                id: "1337010101"
            });
            
            this.rcon.on("connect", () => {
                this.clog("connect", "Start")
                this.setState(RconState.Connected);

                // keep alive
                this.rcon._tcpSocket.setKeepAlive(true, 5000);
                
            })
            this.rcon.on("auth", () => {
                this.clog("Auth", "Start");
                this.setState(RconState.Authenticated);
                clearTimeout(this.reconnectTimer);
            })
            this.rcon.on("server", logToFile)
            this.rcon.on("response", (response) => {
                this.clog(`[Response] (${response.length}) ` + response, "Start");
            })
            this.rcon.on("error", (e) => {
                this.clog(JSON.stringify(e), "START");
                this.setState(RconState.NotConnected);
                this.rcon.disconnect()
            })
            this.rcon.on("end", () => {
                this.clog("ended", "Start");
                this.setState(RconState.NotConnected);
            })

            return this.connect();
        }
        this.dispatchEvent("alreadyconnected");
        this.clog("Tried to restart PersistentRconConnection with already active connection");
    }
    
    dispatchEvent(name, data) {
        this.clog(`[${name.toUpperCase()}]`, "EVENT");
        if (this._events.hasOwnProperty(name)) {
            for (let index = 0; index < this._events[name].length; index++) {
                const fn = this._events[name][index];
                fn(data);
            }
        }
    }

    addTcpCloseEvent() {
        const onPRCONClose = (e) => {
            this.clog(`[CLOSED] with error: ${e}`, "TCP");
            this.dispatchEvent("close", e);

            if (RCON_AUTORECONNECT === "true") {
                this.reconnectTimer = setTimeout(async () => {
                    await this.reconnect();
                }, RCON_AUTORECONNECT_WAIT)
            }

        }
        this.rcon._tcpSocket.on("close", onPRCONClose);
    }

    connect() {
        return new Promise((resolve, reject) => {
            const onAuth = () => {
                clearTimeout(this.connectTimer);
                this.removeRconEventListener("auth", onAuth);
                this.removeRconEventListener("error", onError);
                this.addTcpCloseEvent();
                this.dispatchEvent("connect");
                resolve();
            }

            const onError = (e) => {
                clearTimeout(this.connectTimer);
                this.clog(JSON.stringify(e));
                this.removeRconEventListener("auth", onAuth);
                this.removeRconEventListener("error", onError);
                reject(e);
            }

            this.rcon.on("auth", onAuth);
            this.rcon.on("error", onError);

            this.rcon.connect();

            this.connectTimer = setTimeout(() => {
                this.setState(RconState.NotConnected);
                this.removeRconEventListener("auth", onAuth);
                this.removeRconEventListener("error", onError);
                this.clog("Connect timed out", "CONNECT")
                reject("CONNECT TIMEDOUT");
            }, 10000);
        });
    }

    disconnect() {
        return new Promise((resolve, reject) => {

            const onEnd = () => {
                clearTimeout(this.disconnectTimer);
                this.clog("Disconnected", "Disconnect");
                this.removeRconEventListener("end", onEnd);
                this.removeRconEventListener("error", onError);
                resolve();
            }

            const onError = () => {
                clearTimeout(this.disconnectTimer);
                this.clog(JSON.stringify(e), "Disconnect");
                this.removeRconEventListener("end", onEnd);
                this.removeRconEventListener("error", onError);
                reject(e);
            }

            this.rcon.on("end", onEnd);
            this.rcon.on("error", onError);

            this.rcon.disconnect()

            this.disconnectTimer = setTimeout(() => {
                this.setState(RconState.NotConnected);
                this.removeRconEventListener("end", onEnd);
                this.removeRconEventListener("error", onError);
                this.clog("Disconnect timed out", "DISCONNECT")
                resolve("DISCONNECT TIMEOUT");
            }, 10000);
        });
    }

    async reconnect() {
        if (this.state !== RconState.Connecting) {
            this.setState(RconState.Connecting);
            this.clog("reconnecting", "Reconnect");
            clearTimeout(this.reconnectTimer);
            try {
                await this.disconnect();
                await this.start();
                this.reconnectAttempts = 0;
                this.dispatchEvent("reconnect");
                this.clog("Reconnected", "RECONNECT");
            } catch (err) {
                this.clog(err, "RECONNECT");
                this.setState(RconState.NotConnected);
                if (this.reconnectAttempts === this.maxReconnectAttempts && this.maxReconnectAttempts !== 0) {
                    this.dispatchEvent("maxattemptsreached");
                    this.clog("Max reconnects reached", "RECONNECT");
                    return;
                }
                if (this.reconnectAttempts < this.maxReconnectAttempts || this.maxReconnectAttempts === 0) {
                    this.reconnectAttempts += 1;
                    this.dispatchEvent("reconnecting", {
                        attempt: this.reconnectAttempts,
                        maxAttempts: this.maxReconnectAttempts
                    });
                    this.clog(`Attempt [${this.reconnectAttempts}/${this.maxReconnectAttempts}]`, "RECONNECT")
                    this.reconnectTimer = setTimeout(() => {
                        this.reconnect();
                    }, RCON_AUTORECONNECT_INTERVAL)
                }
            }
            return;
        }
        this.clog("Tried reconnecting but already connecting", "Reconnect");
    }

}


module.exports = {
    PersistentRconConnection
};