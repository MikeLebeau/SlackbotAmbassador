module.exports = {
  transformNameIntoCode: (completeName) => {
    const splitedLol = (completeName).split(/\s/).filter( function(e) { return e.trim().length > 0; } );;
    return (splitedLol[0].charAt(0) + splitedLol[1]).toLowerCase();
  }
}
