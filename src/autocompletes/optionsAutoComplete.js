const cmd = require('../pzcommands');
const {
    rconCommand
} = require("../helper");

const optionsAutoComplete = async (interaction) => {
    try {
        const focusedValue = interaction.options.getFocused();
    
        const response = await rconCommand((rcon) => {
            cmd.showoptions(rcon)
        })
    
        if (response.startsWith("List of Server Options:")) {
            let opts = response.split("*").filter((p, i) => i > 0).map(p => ({
                name: p.trim().split("=")[0].slice(0, 99),
                value: p.trim().split("=")[0].slice(0, 99)
            })).filter(p => p.value.toLowerCase().includes(focusedValue.toLowerCase()));
            interaction.respond(
                opts.slice(0, 24)
            );
            return;
        }
    
        interaction.respond([]);
    } catch (error) {
        console.log(error);
        await interaction.editReply({
            content: "An Error has occurred"
        });
    }
}

module.exports = {
    optionsAutoComplete
};