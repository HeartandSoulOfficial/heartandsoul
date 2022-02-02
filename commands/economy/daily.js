const {discord, MessageEmbed} = require('discord.js')
const dailySchema = require('../../Schema/dailySchema')
const balSchema = require('../../Schema/balSchema')
const ms = require('parse-ms')

module.exports.run = async (client, message, args, gprefix) => {
    const Target = message.member.user

    let data = await dailySchema.findOne({ _id: Target.id })
    let dataB = await balSchema.findOne({ _id: Target.id })
    let now = Date.now()
    let timeout = 86400000

    let newClaim = new MessageEmbed()
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setDescription(`You claimed your daily. Your balance is \`100\``).setColor('BLURPLE')
        .setColor('BLURPLE')
    let claim = new MessageEmbed()
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setColor('BLURPLE')
    let claimed = new MessageEmbed()
        .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
        .setTitle("You already claimed your daily")
        .setColor('NAVY')

    if(!data && !dataB){
        balSchema.create({ _id: Target.id, balance: 100 })
        dailySchema.create({ _id: Target.id, daily: now })
        return message.channel.send({embeds: [newClaim]})
    }

    if(!data && dataB){
        dailySchema.create({ _id: Target.id, daily: now })
        dataB.balance = dataB.balance + 100
        await dataB.save()
        claim.setDescription(`You claimed your daily. Your balance is \`${dataB.balance}\``)
        return message.channel.send({embeds: [claim]})
    }
    
    if(!dataB && data){
        balSchema.create({ _id: Target.id, balance: 100 })
        data.daily = Date.now()
        await data.save()
        return message.channel.send({embeds: [newClaim]})
    }

    if(data && dataB){
        if(timeout - (Date.now() - data.daily) > 0){
            let timeleft = ms(timeout - (Date.now() - data.daily))
            claimed.addField('Please check back in:', `${timeleft.hours} hours, ${timeleft.minutes} minutes, and ${timeleft.seconds} seconds`)
            return message.channel.send({embeds: [claimed]})
        } else{
            dataB.balance = dataB.balance + 100
            await dataB.save()
            claim.setDescription(`You claimed your daily. Your balance is \`${dataB.balance}\``)
            message.channel.send({embeds: [claim]})
        }
    }
    data.daily = Date.now()
    await data.save()
}

module.exports.help = {
    name: 'daily',
    aliases: []
}