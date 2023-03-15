const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
const { messageCommandMessage } = require('../messages/server');
const cmd = require('../pzcommands');

const {
    DISCORD_SERVERSTATUS_CHANNELID
} = process.env;


module.exports = {
    data: new SlashCommandBuilder()
        .setName("message")
        .setDescription("Send a message to the updates channel")
        .addStringOption(option => option.setName("message").setDescription("Message").setRequired(true))
        .addMentionableOption(option => option.setName("user1").setDescription("User 1"))
        .addMentionableOption(option => option.setName("user2").setDescription("User 2"))
        .addMentionableOption(option => option.setName("user3").setDescription("User 3"))
        .addMentionableOption(option => option.setName("user4").setDescription("User 4"))
        .addMentionableOption(option => option.setName("user5").setDescription("User 5"))
        ,
    async execute(interaction, rconConnection, timers, log) {
        messageCommandMessage(interaction)

        interaction.editReply({
            content: "Done"
        })

    },
    async notConnected(interaction) {
        messageCommandMessage(interaction)

        interaction.editReply({
            content: "Done"
        })
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};