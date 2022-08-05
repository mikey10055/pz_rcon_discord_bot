
const cmd = {
    save: (connection) => {
        connection.send("save");
    },
    quit: (connection) => {
        connection.send("quit");
    },
    servermsg: (connection, message) => {
        connection.send(`servermsg "${message}"`)
    },
    teleport: (connection, p1, p2) => {
        connection.send(`teleport "${p1}" "${p2}"`)
    },

    teleportto: (connection, p, x, y, z) => {
        connection.send(`teleportto "${p}" ${x},${y},${z}`)
    },

    additem: (connection, user, item, count) => {
        connection.send(`additem "${user}" "${item}"${count ? ` ${count}` : ""}`);
    },

    adduser: (connection, user, pass) => {
        connection.send(`adduser "${user}" "${pass}"`);
    },

    addvehicle: (connection, vehicle, position) => {
        connection.send(`addvehicle "${vehicle}" ${Array.isArray(position) ? position.join(",") : `"${position}"`}`)
    },

    addxp: (connection, player, perk, xp) => {
        connection.send(`addxp "${player}" ${perk}=${xp}`);
    },

    alarm: (connection) => {
        connection.send("alarm");
    },

    banid: (connection, steamId) => {
        connection.send(`banid ${steamId}`);
    },

    banuser: (connection, user, ipban, reason) => {
        connection.send(`banuser "${user}"${ipban ? " -ip" : ""}${reason ? ` -r "${reason}"` : ""}`);
    },

    changeoption: (connection, option, value) => {
        connection.send(`changeoption ${option} "${value}"`);
    },

    chopper: (connection) => {
        connection.send("chopper");
    },

    createhorde: (connection, count, user) => {
        connection.send(`createhorde ${count} "${user}"`)
    },

    godmod: (connection, user, enabled) => {
        connection.send(`godmod "${user}" ${enabled ? "-true" : "-false"}`)
    },

    gunshot: (connection) => {
        connection.send("gunshot")
    },

    invisible: (connection, user, enabled) => {
        connection.send(`invisible "${user}" ${enabled ? "-true" : "-false"}`)
    },

    kick: (connection, user, reason) => {
        connection.send(`kickuser "${user}"${reason ? ` -r "${reason}"` : ""}`);
    },

    lightning: (connection, user) => {
        connection.send(`lightning "${user}"`)
    },

    noclip: (connection, user, enabled) => {
        connection.send(`noclip "${user}" ${enabled ? "-true" : "-false"}`)
    },

    players: (connection) => {
        connection.send("players");
    },

    reloadlua: (connection, script) => {
        connection.send(`reloadlua "${script}"`);
    },

    reloadoptions: (connection) => {
        connection.send("reloadoptions");
    },

    removeuserfromwhitelist: (connection, user) => {
        connection.send(`removeuserfromwhitelist "${user}"`);
    },

    setaccesslevel: (connection, user, level) => {
        connection.send(`setaccesslevel "${user}" "${level}"`)
    },

    showoptions: (connection) => {
        connection.send("showoptions");
    },

    startrain: (connection, intensity) => {
        connection.send(`startrain${intensity ? ` "${intensity}"` : ""}`);
    },

    starstorm: (connection, duration) => {
        connection.send(`starstorm${duration ? ` "${duration}"` : ""}`);
    },

    stoprain: (connection) => {
        connection.send("stoprain");
    },

    stopweather: (connection) => {
        connection.send("stopweather");
    },

    thunder: (connection, user) => {
        connection.send(`thunder "${user}"`);
    },

    unbanid: (connection, steamId) => {
        connection.send(`unbanid ${steamId}`);
    },

    unbanuser: (connection, user) => {
        connection.send(`unbanuser "${user}"`);
    },

    voiceban: (connection, user, enabled) => {
        connection.send(`voiceban "${user}" ${enabled ? "-true" : "-false"}`)
    }
};


module.exports = cmd;