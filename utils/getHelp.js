module.exports = {
  /**
   * Petite fonction pour afficher l'aide
   * @returns {*}
   */
  getHelp: () => {
    return `
    \t\`/ambassadeur\`\n
    \t\tCa c'est pour avoir les ambassadeurs actuels\n
    \t\`/ambassadeur next\`\n
    \t\tCa c'est pour désigner les ambassadeurs pour la semaine prochaine\n
    \t\`/ambassadeur next [ITC|ACDC|BDL]\`\n
    \t\tCa c'est pour désigner une autre personne qui doit être ambassadeur pour l'équipe donnée\n
    \t\`/ambassadeur help\`\n
    \t\tHahahaha t'as vraiment besoin que j'explicite le truc ???\n
    \t\`/ambassadeur userUpdate\`\n
    \t\tCa c'est pour mettre à jour la liste des dudes (pour pouvoir les mentionner correctement (au cas où t'ai pas compris lol))
  `;
  }
}
