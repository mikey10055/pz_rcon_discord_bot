const {
    SlashCommandBuilder
} = require('discord.js');
const { ServerStatus } = require('../../config/messages');
const { rconCommand } = require('../helper');
const cmd = require('../pzcommands');
const ServerStatusEnum = require('../serverStates');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Current server status")
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log, isRestarting) {
        cmd.players(rconConnection)
    },
    async reply(interaction, response, isRestarting) {
        if (response) {
            interaction.editReply({
                embeds: [
                    ServerStatus(
                        isRestarting.serverRestartPending === ServerStatusEnum.Restarting ?
                        ServerStatusEnum.Restarting :
                        ServerStatusEnum.Online
                    )
                ]
            });

            return;
        }
        interaction.editReply({
            embeds: [ServerStatus(ServerStatusEnum.Offline)]
        })
    },
    async notConnected(interaction) {
        interaction.editReply({
            embeds: [ServerStatus(ServerStatusEnum.Offline)]
        })
    }
};