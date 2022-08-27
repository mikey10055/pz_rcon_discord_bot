const cmd = require('../pzcommands');
const {
    rconCommand
} = require("../helper");

const {
    PZ_USER,
    PZ_INVALID_PERK
} = process.env;

const perkAutoComplete = async (interaction) => {
    try {
        const focusedValue = interaction.options.getFocused();

        const player = interaction.options.getString('player');

        const response = await rconCommand((rcon) => {
            cmd.addxp(rcon, player, PZ_INVALID_PERK, 0);
        });
    
        if (response.startsWith("List of available perks")) {
            let perks = response.split("\n").filter((p, i) => i > 0).map(p => ({
                name: p.trim().slice(0, 99),
                value: p.trim().slice(0, 99)
            })).filter(p => p.value.toLowerCase().startsWith(focusedValue.toLowerCase()));
            interaction.respond(
                perks.slice(0, 24)
            );
            return;
        }
    
        interaction.respond([]);
    } catch (error) {
        console.log(error);
        await interaction.respond([]);
    }
}

module.exports = {
    perkAutoComplete
};