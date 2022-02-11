const {discord, MessageEmbed} = require('discord.js');
const balSchema = require('../../Schema/balSchema')

module.exports.run = async (client, message, args, gprefix) => {
    let amount;
    let Target = message.mentions.users.first()

    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that user.")
        .setColor('FUCHSIA')
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to add money to the user.")
        .setColor('YELLOW')

    if(args.length == 0) return message.channel.send({embeds: [unfound]})

    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) } 
        catch(err){ return message.channel.send({embeds: [unfound]}) }
    }

    amount = parseInt(args[1])
    if(Number.isNaN(amount) || amount < 0) return message.channel.send({embeds: [invalid]})

    let data = await balSchema.findOne({ _id: Target.id })
    let success = new MessageEmbed().setColor('GREEN');

    if(!data){
        success.setDescription(`Added ${amount.toLocaleString()} to ${Target} balance. New balance is \`${amount.toLocaleString()}\`.`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else {
        data.balance = data.balance + amount
        await data.save()
        success.setDescription(`Added ${amount.toLocaleString()} to ${Target} balance. New balance is \`${data.balance.toLocaleString()}\`.`)
    }
    message.channel.send({embeds: [success]})
}

module.exports.help = {
    name: 'add-money',
    aliases: ['add'],
    permLevel: "Bot Owner"
}
