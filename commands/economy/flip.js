const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')

module.exports.run = async (client, message, args, gprefix) => {
    let amount = args[0];
    let random = Math.floor(Math.random() * 2)
    const Target = message.member.user

    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to coin flip.")
        .setColor('YELLOW')

    const broke = new MessageEmbed()
        .setDescription("You do not have enough money to coin flip")
        .setColor('WHITE')

    const lost = new MessageEmbed()
        .setColor('DARK_BLUE')

    const win = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')

    if(amount != 'half' && amount != 'all'){
        amount = parseInt(amount)
        if(Number.isNaN(amount) || amount < 0) return message.channel.send({embeds: [invalid]})
    }

    let data = await balSchema.findOne({ _id: Target.id })
    if(!data){
        balSchema.create({ _id: Target.id, balance: 0 })
        return message.channel.send({embeds: [broke]})
    }

    if (data.balance < amount){
        return message.channel.send({embeds: [broke]})
    }

    if(amount == 'half'){
        amount = Math.floor(data.balance/2)
    } else if(amount == 'all'){
        amount = data.balance
    }

    if(random == 0){
        if (data.balance < amount){
            data.balance = 0
        } else {
            data.balance = data.balance - amount
        }
        await data.save()
        lost.setDescription(`**The coin landed on tails.**\nYou lost __${amount.toLocaleString()}__\nNew balance is \`${data.balance.toLocaleString()}\``)
        message.channel.send({embeds: [lost]})
    } else{
        data.balance = data.balance + amount
        await data.save()
        win.setDescription(`**The coin landed on heads.**\nYou won __${amount.toLocaleString()}__\nNew balance is \`${data.balance.toLocaleString()}\``)
        message.channel.send({embeds: [win]})
    }
}

module.exports.help = {
    name: "coinflip",
    aliases: ['cf','flip']
}