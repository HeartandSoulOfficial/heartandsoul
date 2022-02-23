const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')
const {invalid, broke} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let amount = args[0];
    let random = Math.floor(Math.random() * 2)
    const Target = message.member.user //Message author

    const lost = new MessageEmbed()
        .setColor('DARK_BLUE')
    const win = new MessageEmbed()
        .setColor('LUMINOUS_VIVID_PINK')
    //Parse int if not args is not half or all
    if(amount != 'half' && amount != 'all'){
        amount = parseInt(amount) //If number is NaN or less than 1 return invalid
        if(Number.isNaN(amount) || amount < 1) return invalid(message, 'coin flip.')
    }
    //Find data
    let data = await balSchema.findOne({ _id: Target.id })
    if(!data){ //If data doesn't exist create and return broke
        balSchema.create({ _id: Target.id, balance: 0 })
        return broke(message, 'coin flip.')
    }
    //If balance is less than amount return broke
    if (data.balance < amount){
        return broke(message, 'coin flip.')
    }
    //if amount is half
    if(amount == 'half'){ //If balance is one set to amount to 1
        if (data.balance == 1){
            amount = 1
        } else { //Else divide balance by 2 and round down
            amount = Math.floor(data.balance/2)
        } //If amount is all set amount to user's entire balance
    } else if(amount == 'all'){
        amount = data.balance
    }

    if(random == 0){//Lost
        data.balance = data.balance - amount
        await data.save()
        lost.setDescription(`**The coin landed on tails.**\nYou lost __${amount.toLocaleString()}__\nNew balance is \`${data.balance.toLocaleString()}\``)
        message.channel.send({embeds: [lost]})
    } else{//Win
        data.balance = data.balance + amount
        await data.save()
        win.setDescription(`**The coin landed on heads.**\nYou won __${amount.toLocaleString()}__\nNew balance is \`${data.balance.toLocaleString()}\``)
        message.channel.send({embeds: [win]})
    }
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: "coinflip",
    aliases: ['cf','flip'],
    module: "Economy",
    description: "Coinflip an amount to earn or lose amount.",
    usage: "coinflip [amount]"
}
