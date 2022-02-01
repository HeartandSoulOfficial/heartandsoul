const {discord, MessageEmbed} = require('discord.js');
const balSchema = require('../../Schema/balSchema')

module.exports.run = async (client, message, args, gprefix) => {
    let amount = args[1];
    let Target = message.mentions.users.first()
    let Member = message.member.user

    const unfound = new MessageEmbed()
        .setDescription("Couldn't find that user.")
        .setColor('FUCHSIA')
    const invalid = new MessageEmbed()
        .setDescription("Enter a valid number to give money to the user.")
        .setColor('YELLOW')
    const broke = new MessageEmbed()
        .setDescription("You do not have enough money to give to the user")
        .setColor('WHITE')

    if(args.length == 0) return message.channel.send({embeds: [unfound]})

    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) } 
        catch(err){ return message.channel.send({embeds: [unfound]}) }
    }

    if(amount != 'half' && amount != 'all'){
        amount = parseInt(amount)
        if(Number.isNaN(amount) || amount < 0) return message.channel.send({embeds: [invalid]})
    }
    let data = await balSchema.findOne({ _id: Target.id })
    let giverData = await balSchema.findOne({ _id: Member.id })
    let success = new MessageEmbed().setColor('GREEN');

    if(!giverData){
        await balSchema.create({ _id: Member.id, balance: 0 })
        return message.channel.send({embeds: [broke]})
    }
    
    if(giverData.balance < amount){
        return message.channel.send({embeds: [broke]})
    }

    if(amount == 'half'){
        amount = Math.floor(giverData.balance/2)
    } else if(amount == 'all'){
        amount = giverData.balance
    }

    if(!data){
        giverData.balance = giverData.balance - amount
        success.setDescription(`Gave ${amount.toLocaleString()} to ${Target}`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else {
        giverData.balance = giverData.balance - amount
        data.balance = data.balance + amount
        await data.save()
        success.setDescription(`Gave ${amount.toLocaleString()} to ${Target}`)
    }
    await giverData.save()
    message.channel.send({embeds: [success]})
}

module.exports.help = {
    name: 'give'
}