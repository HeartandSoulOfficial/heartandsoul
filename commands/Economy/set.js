const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')
const {unfound, invalid} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let amount;
    let Target = message.mentions.users.first()//Message author
    //If args length is 0 return invalid
    if(args.length == 0) return invalid(message, 'set money to the user.')
    //If can''t find Target by mention fetch by ID
    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) }
        catch(err){ return unfound(message) } //If can't find ID return unfound
    }
    //Parse int
    amount = parseInt(args[1])
    if(Number.isNaN(amount) || amount < 0) return invalid(message, 'set money to the user.') //If amount is NaN or less than 0 return invalid
    //Find Data
    let data = await balSchema.findOne({ _id: Target.id })
    let success = new MessageEmbed().setColor('GREEN')
    //If data doesn't exist create Target data and set balance to amount
    if(!data){
        success.setDescription(`Set ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else { //Else set data balance to amount
        data.balance = amount
        await data.save() //Save data
        success.setDescription(`Set ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
    }
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: "Bot Owner"
}

module.exports.help = {
    name: 'set-money',
    aliases: ['set'],
    module: "Economy",
    description: "Sets the user balance to an amount.",
    usage: "set-money [user] [amount]"
}
