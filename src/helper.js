const hasRole = (member, role) => member.roles.cache.has(role);

const notConnectedToRcon = async (interaction) => {
    await interaction.reply({
        content: "Dosen't seem to be connected to server, try /connect",
        ephemeral: true
    });
}


module.exports = {
    hasRole,
    notConnectedToRcon
}