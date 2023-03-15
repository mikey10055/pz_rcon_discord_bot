const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const cmd = require('../pzcommands');
const { isAutoCompleteOn } = require('../helper');
const { optionsAutoComplete } = require('../autocompletes/optionsAutoComplete');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("showoptions")
        .setDescription("Show the list of current server options and values.")
        .addStringOption(option =>
                option.setName('option')
                .setDescription('select option to view')
                .setRequired(true)
                .setAutocomplete(isAutoCompleteOn()))
        ,
    async execute(interaction, rconConnection, timers, log) {
        cmd.showoptions(rconConnection);
    },
    async reply(interaction, response) {
        if (response.startsWith("List of Server Options:")) {
            const optionValue = interaction.options.getString("option");
            const options =  response.replace("List of Server Options:", "").split("*").map((opt, indx) => {
                const opts = opt.split("=");
                const name = opts[0] ? opts[0].replace("\n", "") : "";
                const value = opts[1] ? opts[1].replace("\n", "") : ""
                return {
                    name: name.length > 0 ? name : "no name",
                    value: value.length > 0 ? value : "no value",
                    inline: true
                }
            }).filter(op => {
                return typeof op.name !== undefined && typeof op.value !== undefined;
            }).filter(op => 
                op.name.toLowerCase().includes(optionValue.toLowerCase())
            )

            const result = options.length > 0 ? options.slice(0, 24) : [{name: "missing", value: "settings"}]

            const responseEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle("Server Options")
                .addFields(...result)
                .setFooter({
                    text: options.length > 24 ? 
                    `${options.length} in list. Only 24 shown. try narrowing your search.` : 
                    `Showing ${options.length}`
                })
                .setTimestamp()

            interaction.editReply({embeds: [responseEmbed]});
            return;
        }

        interaction.editReply(response);
    },
    async autocomplete(interaction) {
        optionsAutoComplete(interaction);
    }
};