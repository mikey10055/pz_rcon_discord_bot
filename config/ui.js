module.exports = {
    commands: {
        Quitting: "Quitting",
        CancelledShutdown: "Cancelled server quit",
        NothingToCancel: "Nothing to cancel.",
        AlreadyShuttingDown: "Already shutting down",
        quit: {
            description: "Save and quit the server.",
            now: {
                description: "Save and quit immediately"
            },
            in: {
                description: "Save and quit in `x` minutes.",
                timeOptionDescription: "How long in minites until the server saves and quits",
                reply: (mins) => `Quitting in ${mins} ${mins != 1 ? "minutes" : "minute"}`
            },
            cancel: {
                description: "Cancel save and quit."
            }
        }
    }
}
