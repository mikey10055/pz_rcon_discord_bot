const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const {
    notConnectedToRcon, isAutoCompleteOn
} = require('../helper');

const cmd = require("../pzcommands.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("additem")
        .setDescription("Give an item to a player. Count is optional")
        .addStringOption(option => option.setName("player").setDescription("Enter player to add item to").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        .addStringOption(option => option.setName("item").setDescription("Enter item to give to player").setRequired(true))
        .addIntegerOption(option => option.setName("count").setDescription("The number of items to give").setRequired(false))
        .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {

            const player = interaction.options.getString('player');
            const item = interaction.options.getString('item');
            const count = interaction.options.getInteger('count');

            // rcon command `additem` dosen't seem to respond with anything on a success
            setTimeout(() => {
                if (!interaction.replied) {
                    interaction.editReply({content: `${count ? count : "1"} ${item} given to ${player}.`})
                }
            }, 1500);

            cmd.additem(rconConnection, player, item, count);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};