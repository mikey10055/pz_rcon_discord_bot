const fs = require("node:fs");
const path = require("node:path");

const getDateString = () => new Date().toISOString().replace("T", "_").replace("Z", "").replace(/:/g, ".");

const fileName = `${getDateString()}-log.txt`;

const logPath = path.join(__dirname, "../logs", fileName);

fs.writeFile(logPath, `<${getDateString()}> Bot Started\r\n`, function (err) {
    if (err) {
        return console.log(err);
    }
});


const logToFile = (text) => {
    fs.appendFile(logPath, `<${getDateString()}> ${text}\r\n`, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

module.exports = {
    logToFile
}