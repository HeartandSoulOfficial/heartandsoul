const {discord, MessageEmbed} = require('discord.js');
const balSchema = require('../../Schema/balSchema')
const {unfound, invalid} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let amount;
    let Target = message.mentions.users.first()
    //No args
    if(args.length == 0) return unfound(message)
    //Can't find using mention use ID else catch and return invalid ID
    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) } 
        catch(err){ return unfound(message) }
    }
    //Turn into int and if isn't number or less than 1 return invalid
    amount = parseInt(args[1])
    if(Number.isNaN(amount) || amount < 1) return invalid(message, 'add money to the user.')
    //Fetch data
    let data = await balSchema.findOne({ _id: Target.id })
    let success = new MessageEmbed().setColor('GREEN');
    //If no data create one and set balance to amount
    if(!data){
        success.setDescription(`Added ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else {//Set balance to amount
        data.balance = data.balance + amount
        await data.save()
        success.setDescription(`Added ${amount.toLocaleString()} to ${Target} balance. New balance is \`${data.balance.toLocaleString()}\`.`)
    }
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: "Bot Owner"
}

module.exports.help = {
    name: 'add-money',
    aliases: ['add'],
    module: "Economy",
    description: "Adds to the user balance a certain amount.",
    usage: "add-money [user] [amount]"
}
