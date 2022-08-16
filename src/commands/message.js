const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const { isAutoCompleteOn } = require('../helper');
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
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {
        const message = interaction.options.getString("message");
        const user1 = interaction.options.getMentionable("user1");
        const user2 = interaction.options.getMentionable("user2");
        const user3 = interaction.options.getMentionable("user3");
        const user4 = interaction.options.getMentionable("user4");
        const user5 = interaction.options.getMentionable("user5");

        if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
            client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
                content: `${message}\r\n\r\n${user1 ? `${user1} ` : ""}${user2 ? `${user2} ` : ""}${user3 ? `${user3} ` : ""}${user4 ? `${user4} ` : ""}${user5 ? `${user5} ` : ""}`
            });
        }

        interaction.editReply({
            content: "Done"
        })

    },
    async notConnected(interaction, client) {
        const message = interaction.options.getString("message");
        const user1 = interaction.options.getMentionable("user1");
        const user2 = interaction.options.getMentionable("user2");
        const user3 = interaction.options.getMentionable("user3");
        const user4 = interaction.options.getMentionable("user4");
        const user5 = interaction.options.getMentionable("user5");

        if (DISCORD_SERVERSTATUS_CHANNELID && DISCORD_SERVERSTATUS_CHANNELID.length > 0) {
            client.channels.cache.get(DISCORD_SERVERSTATUS_CHANNELID).send({
                content: `${message}\r\n\r\n${user1 ? `${user1} ` : ""}${user2 ? `${user2} ` : ""}${user3 ? `${user3} ` : ""}${user4 ? `${user4} ` : ""}${user5 ? `${user5} ` : ""}`
            });
        }

        interaction.editReply({
            content: "Done"
        })
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};