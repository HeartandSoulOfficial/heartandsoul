const config = require('./config')

function permlevel(message) {
    let permlvl = 0;
  
    const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
  
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (message.guild && currentLevel.guildOnly) continue;
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
}

function Fix(variable) {
    if(variable){
        return "Yes"
    } else if(!variable){
        return "No"
    } else if(variable == undefined || variable == null){
        return "None"
    } else if(variable == '#000000' || variable == '#0'){
        return "None"
    } else if(variable == "NONE") {
        return "None"
    } else return variable
}

function fixTier(variable) {
    if(variable == "NONE"){
        return "None"
    } else {
        let words = variable.split("_")
        let combined = []
        for(let j of words){
            let word = j.toLowerCase()
            combined.push(word[0].toUpperCase()+word.substring(1))
        }
        return combined.join(" ")
    }
}

function fixVanity(variable) {
    if(variable == null){
        return "None"
    } else{
        return `[discord.gg/${variable}](https://discord.gg/${variable})`
    }
}

module.exports = {permlevel, Fix, fixTier, fixVanity}