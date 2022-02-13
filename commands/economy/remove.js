const {discord, MessageEmbed} = require('discord.js')
const balSchema = require('../../Schema/balSchema')
const {unfound, invalid} = require('../../functions')

module.exports.run = async (client, message, args, gprefix) => {
    let amount;
    let Target = message.mentions.users.first() //Message author
    //If args length is 0 return unfound
    if(args.length == 0) return unfound(message)

    if(!Target){ //If Target mention doesn't exist find by ID
        try{ Target = await message.guild.members.fetch(args[0]) } 
        catch(err){ return unfound(message) } //If can't find ID return unfound
    }
    //Parse int
    amount = parseInt(args[1])
    if(Number.isNaN(amount) || amount < 1) return invalid(message, 'remove from from the user.') //If number is invalid or less than 1 return invalid
    //Find data
    let data = await balSchema.findOne({ _id: Target.id })
    let success = new MessageEmbed().setColor('GREEN');
    //If data doesn't exist set Target balance to 0 and return balance of 0
    if(!data){
        success.setDescription(`Removed ${amount.toLocaleString()} from ${Target} balance. New balance is \`0\`.`)
        await balSchema.create({ _id: Target.id, balance: 0 })
    } else {//Else data exists
        if (data.balance-amount >= 0){ //If data balance minus amount is greater than 0 subtract
            data.balance = data.balance - amount
        } else { //Else set balance to 0
            data.balance = 0
        }
        await data.save() //Save data
        success.setDescription(`Removed ${amount.toLocaleString()} from ${Target} balance. New balance is \`${data.balance.toLocaleString()}\`.`)
    }
    message.channel.send({embeds: [success]})
}

module.exports.help = {
    name: 'remove-money',
    aliases: ['remove'],
    permLevel: "Bot Owner"
}