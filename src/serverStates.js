const ServerStatusEnum = {
    Online: 0,
    Restarting: 1,
    Offline: 2
}

const RconState = {
    NotConnected: 0,
    Connecting: 1,
    Connected: 2,
    Authenticated: 3
}

module.exports = {
    ServerStatusEnum,
    RconState
}
