const cmd = require('../pzcommands');
const {
    rconCommand
} = require("../helper");

const playerAutoComplete = async (interaction) =>{
    try {
        const focusedValue = interaction.options.getFocused();
    
        const response = await rconCommand((rcon) => {
            cmd.players(rcon)
        })
    
        if (response.startsWith("Players connected")) {
            let players = response.split("-").filter((p, i) => i > 0).map(p => ({
                name: p.trim().slice(0, 99),
                value: p.trim().slice(0, 99)
            })).filter(p => p.value.toLowerCase().startsWith(focusedValue.toLowerCase()));
            interaction.respond(
                players.slice(0, 24)
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
    playerAutoComplete
};