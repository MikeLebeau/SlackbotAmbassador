module.exports = {
  /**
   * Petite fonction pour afficher l'aide
   * @returns {*}
   */
  name: 'help',
  description: 'Hahahaha t\'as vraiment besoin que j\'explique le truc ???',
  method: (allCommands) => {
    let response = ``;

    Object.keys(allCommands).forEach(commandName => {
      response += `\`/ambassadeur ${allCommands[commandName].name}\`\n`;
      response += `\t${allCommands[commandName].description}\n`;
    });

    return response;
  }
}
