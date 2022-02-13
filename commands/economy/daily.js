const {discord, MessageEmbed} = require('discord.js')
const dailySchema = require('../../Schema/dailySchema')
const balSchema = require('../../Schema/balSchema')
const ms = require('parse-ms')

module.exports.run = async (client, message, args, gprefix) => {
    const Target = message.member.user //Message author
    //Find user's dailySchema
    let data = await dailySchema.findOne({ _id: Target.id })
    let dataB = await balSchema.findOne({ _id: Target.id }) //Find user's balSchema
    let now = Date.now() //Current time
    let timeout = 86400000 //1 day

    let newClaim = new MessageEmbed()//New user claim
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setDescription(`You claimed your daily. Your balance is \`100\``).setColor('BLURPLE')
        .setColor('BLURPLE')
    let claim = new MessageEmbed() //Claiming daily
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setColor('BLURPLE')
    let claimed = new MessageEmbed()//Already claimed
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setTitle("You already claimed your daily")
        .setColor('NAVY')

    if(!data && !dataB){ //If no balance and no daily cd exists create one and set bal to daily
        balSchema.create({ _id: Target.id, balance: 100 })
        dailySchema.create({ _id: Target.id, daily: now })
        return message.channel.send({embeds: [newClaim]})
    }
    //If daily cd doesn't exist and balance exists add to balance and set cd
    if(!data && dataB){
        dailySchema.create({ _id: Target.id, daily: now })
        dataB.balance = dataB.balance + 100
        await dataB.save()
        claim.setDescription(`You claimed your daily. Your balance is \`${dataB.balance}\``)
        return message.channel.send({embeds: [claim]})
    }
    //If balance doesn't exist and daily cd does exist somehow add balance and new cd
    if(!dataB && data){
        balSchema.create({ _id: Target.id, balance: 100 })
        data.daily = Date.now()
        await data.save()
        return message.channel.send({embeds: [newClaim]})
    }

    if(data && dataB){//If daily cd exists and balance exists
        if(timeout - (Date.now() - data.daily) > 0){ //Already claimed daily
            let timeleft = ms(timeout - (Date.now() - data.daily))
            claimed.addField('Please check back in:', `${timeleft.hours} hours, ${timeleft.minutes} minutes, and ${timeleft.seconds} seconds`)
            return message.channel.send({embeds: [claimed]})
        } else{//Claim daily
            dataB.balance = dataB.balance + 100
            await dataB.save()
            claim.setDescription(`You claimed your daily. Your balance is \`${dataB.balance}\``)
            message.channel.send({embeds: [claim]})
        }
    }//Save daily cd data and save data
    data.daily = Date.now()
    await data.save()
}

module.exports.help = {
    name: 'daily',
    aliases: [],
    permLevel: "User"
}