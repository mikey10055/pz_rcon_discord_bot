const readline = require("readline");
const { rconCommand } = require("./helper");
const { logToFile } = require("./logging");

class RconTerminal {

    commands = [{
        name: "exit",
        fn: (txt) => {
            process.exit(0);
        }
    }];

    #rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    #prompt = (query) => new Promise((resolve) => this.#rl.question(query, resolve));

    log = (text) => {
        this.newLine();
        console.log(text);
        this.newLine();
    }

    addCommand = (command) => {
        this.commands.push(command);
    }

    runCommands = (txt) => {
        for (let index = 0; index < this.commands.length; index++) {
            const cmd = this.commands[index];
            if (txt === cmd.name) {
                cmd.fn(txt);
                return true;
            }
        }
        return false;
    }

    newLine = (async () => {
        try {
            const txt = await this.#prompt(`>: `);
            const hasrun = this. runCommands(txt);
            if (!hasrun) {
                const response = await rconCommand((rcon) => {
                    rcon.send(txt);
                });
                console.log(response);
            }

            this.newLine();
        } catch (e) {
            this.log(e)
        }
    });

    init() {
        this.#rl.on('close', () => process.exit(0));
    }
}

module.exports = RconTerminal;