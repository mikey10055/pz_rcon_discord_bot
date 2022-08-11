module.exports = {
    quit: {
        /**
         * initalMessage: {x} is replaced with minites till shutdown
         * example ->
         * intitalMessage = Server shutting down in {x}
         *      will become: Server shutting down in 20 minutes
         */
        intitalMessage: "Server shutting down in {x}",
        warning10m: "Server shutting down in 10 minutes",
        warning5m: "Server shutting down in 5 minutes",
        warning3m: "Server shutting down in 3 minutes",
        warning1m: "Server shutting down in 1 minute",
        warning30s: "Server shutting down in 30 seconds",
        canceled: "Server shutdown cancelled"
    }
}