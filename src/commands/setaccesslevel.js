const {
    SlashCommandBuilder
} = require('discord.js');
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');
const {
    notConnectedToRcon, isAutoCompleteOn
} = require('../helper');

const cmd = require('../pzcommands');

module.exports = {
    data: new SlashCommandBuilder()
            .setName("setaccesslevel")
            .setDescription("Set access level of a player. Current levels: Admin, Moderator, Overseer, GM, Observer.")
            .addStringOption(option => option.setName("player").setDescription("Enter player name").setRequired(true).setAutocomplete(isAutoCompleteOn()))
            .addStringOption(option => 
                option.setName("level")
                .setDescription("Select access level")
                .setRequired(true)
                .addChoices(
                    { name: 'Admin', value: 'admin' },
                    { name: 'Moderator', value: 'moderator' },
                    { name: 'GM', value: 'gm' },
                    { name: 'Observer', value: 'observer' },
                    { name: 'Priority', value: 'priority' },
                    { name: 'User', value: 'user' },
                    { name: 'Banned', value: 'banned' }
                )
            )
            .setDefaultMemberPermissions(0),
    async execute(interaction, rconConnection, timers, log) {

        const user = interaction.options.getString('player');
        const level = interaction.options.getString('level');

        cmd.setaccesslevel(rconConnection, user, level);
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};