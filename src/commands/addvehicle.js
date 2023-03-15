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
        .setName("addvehicle")
        .setDescription("Spawn a vehicle.")
        .addSubcommand(sub => sub
            .setName("player")
            .setDescription("Spawn vehicle at players position")
            .addStringOption(option => option.setName("vehicle").setDescription("Vehicle to spawn").setRequired(true))
            .addStringOption(option => option.setName("player").setDescription("player to spawn vehicle at").setRequired(true).setAutocomplete(isAutoCompleteOn()))
        )
        .addSubcommand(sub => sub
            .setName("coordinate")
            .setDescription("Spawn a vehicle at x,y,z coordinates")
            .addStringOption(option => option.setName("vehicle").setDescription("Vehicle to spawn").setRequired(true))
            .addIntegerOption(option => option.setName("x").setDescription("x coordinate").setRequired(true))
            .addIntegerOption(option => option.setName("y").setDescription("y coordinate").setRequired(true))
            .addIntegerOption(option => option.setName("z").setDescription("z coordinate").setRequired(true))
        ),
    async execute(interaction, rconConnection, timer, log) {
            const sub = interaction.options.getSubcommand();

            if (sub === "player") {
                const vehicle = interaction.options.getString('vehicle');
                const player = interaction.options.getString('player');

                cmd.addvehicleplayer(rconConnection, vehicle, player);
                return;
            }

            if (sub === "coordinate") {
                const v = interaction.options.getString('vehicle');
                const x = interaction.options.getInteger('x');
                const y = interaction.options.getInteger('y');
                const z = interaction.options.getInteger('z');

                cmd.addvehiclexyz(rconConnection, v, x, y, z);
                return;
            }

    },
    async autocomplete(interaction) {
        await playerAutoComplete(interaction);
    }
};