const config = require('./config')
const {MessageEmbed} = require('discord.js')

function permlevel(message) {
    let permlvl = 0;
  
    const permOrder = config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
  
    while (permOrder.length) {
      const currentLevel = permOrder.shift();
      if (currentLevel.check(message)) {
        permlvl = currentLevel.level;
        break;
      }
    }
    return permlvl;
}

function Fix(variable) {
    if(variable == true){
        return "Yes"
    } else if(!variable && variable != ""){
        return "No"
    } else if(variable == undefined || variable == null || variable == ""){
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

function unfound(message, args) {
    const unfound = new MessageEmbed()
        .setDescription(`Couldn't find ${args}`)
        .setColor('FUCHSIA')
    return message.channel.send({embeds: [unfound]})
}

function invalid(message, args){
    const invalid = new MessageEmbed()
        .setDescription(`Enter a valid number to ${args}`)
        .setColor('YELLOW')
    return message.channel.send({embeds: [invalid]})
}

function broke(message, args){
    const broke = new MessageEmbed()
        .setDescription(`You do not have enough money to ${args}`)
        .setColor('WHITE')
    return message.channel.send({embeds: [broke]})
}

function unable(message){
    const unable = new MessageEmbed()
        .setDescription('That role is above me.')
        .setColor('RED')
    return message.channel.send({embeds: [unable]})
}

function userUnable(message){
    const userUnable = new MessageEmbed()
        .setDescription('That role is above you.')
        .setColor('RED')
    return message.channel.send({embeds: [userUnable]})
}

function cancelled(message){
    const cancelled = new MessageEmbed()
        .setDescription('Action cancelled.')
        .setColor('DARK_BUT_NOT_BLACK')
    return message.channel.send({embeds: [cancelled]})
}

function fixHelp(message, helpArray){
    let array = []
    let all = ""
    for (let i=0; i<helpArray.length; i++){
        if ((all.length > 41 || all.length + helpArray[i].length) > 40){
            all = all.slice(0, -1) + "\n"
            array.push(all)
            all = ""
        }
        all += `${helpArray[i]} `
        if(helpArray.length-1 == i){
            array.push(all)
        }
    }
    return array.join(" ")
}

function commonPerms(message, keyPerms, perms){
    let hasKeyPerms = []
    for(let i=0; i<perms.length; i++){
        if(keyPerms.includes(perms[i])){
            if(perms[i] == 'MANAGE_GUILD'){
                perms[i] = 'MANAGE_SERVER'
            }
            if(perms[i] == 'MODERATE_MEMBERS'){
                perms[i] = 'TIMEOUT_MEMBERS'
            }
            let words = perms[i].split("_")
            let combined = []
            for(let j of words){
                let word = j.toLowerCase()
                combined.push(word[0].toUpperCase()+word.substring(1))
            }
            hasKeyPerms.push(combined.join(' '))
        }
    }
    return hasKeyPerms
}

async function awaitReply(msg, question, limit = 60000) {
    const filter = m => m.author.id === msg.author.id;
    await msg.channel.send(question);
    try {
        const collected = await msg.channel.awaitMessages({ filter, max: 1, time: limit, errors: ["time"] });
        return collected.first().content;
    } catch (e) {
        return false;
    }
}

function fixRoleMention(message, roleArray){
    if(roleArray.length == 0) return "None"
    let roleMentionArray = []
    for (let i=0; i<roleArray.length; i++){
        roleMentionArray.push(`<@&${roleArray[i]}>`)
    }
    return roleMentionArray.join(" ")
}

module.exports = {permlevel, Fix, fixTier, fixVanity, unfound, invalid, broke, unable, userUnable, cancelled, fixHelp, commonPerms, awaitReply, fixRoleMention}