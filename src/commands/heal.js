const {
    SlashCommandBuilder
} = require('discord.js');
const {
    triggerCommand, isAutoCompleteOn, rconCommand
} = require("../helper");
const { playerAutoComplete } = require('../autocompletes/playerAutoComplete');

const cmd = require('../pzcommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("heal")
        .setDescription("Heals a player.")
        .addStringOption(option => option.setName("player").setDescription("Player to heal").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        ,
    async execute(interaction, rconConnection, timers, log) {
        const player = interaction.options.getString("player");
        cmd.godmod(rconConnection, player, true);
    },
    async reply(interaction) {
        const player = interaction.options.getString("player");

        try {
            const response = await rconCommand((rcon) => {
                cmd.godmod(rcon, player, false);
            })
            if (response.includes("is no more invincible")) {
                await interaction.editReply({
                    content: `${player} has been healed`
                });
                return
            }
    
            await interaction.editReply({
                content: response
            });
        } catch (error) {
            console.log(error);
            await interaction.editReply({
                content: "An Error has occurred"
            });
        }

        
    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};