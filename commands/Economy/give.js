const {discord, MessageEmbed} = require('discord.js');
const balSchema = require('../../Schema/balSchema')
const {unfound, invalid, broke} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    let amount = args[1];
    let Target = message.mentions.users.first() //Recipient
    let Member = message.member.user //Message author

    const self = new MessageEmbed()
        .setDescription('Hey! You can\'t give money to yourself.')
        .setColor('DARK_VIVID_PINK')
    //If args length is 0 return unable to find recipient
    if(args.length == 0) return unfound(message)
    //If unable to find Target using mention use ID
    if(!Target){
        try{ Target = await message.guild.members.fetch(args[0]) } 
        catch(err){ return unfound(message) } //Invalid ID return unfound
    }
    //If Target is equal to member return self
    if (Target.id == Member.id) return message.channel.send({embeds: [self]})
    //If amount is not half and all parse int
    if(amount != 'half' && amount != 'all'){
        amount = parseInt(amount)
        if(Number.isNaN(amount) || amount < 1) return invalid(message, 'give money to the user.') //Invalid amount or amount is less than 1
    }
    //Fetch Target's data
    let data = await balSchema.findOne({ _id: Target.id })
    let giverData = await balSchema.findOne({ _id: Member.id }) //Fetch giver's data
    let success = new MessageEmbed().setColor('GREEN');
    //If giverData doesn't exist or create a
    if(!giverData){
        await balSchema.create({ _id: Member.id, balance: 0 })
        return broke(message, 'give to the user.')
    }
    if(giverData.balance < amount || giverData.balance < 1){ //If balance is less than amount or 1 return broke
        return broke(message, 'give to the user.')
    }
    if(amount == 'half'){ //If amount is half then set amount to half of giverData balance
        amount = Math.floor(giverData.balance/2)
    } else if(amount == 'all'){ //If amount is all set amount to all of giverData balance
        amount = giverData.balance
    }

    if(!data){ //If recipient data doesn't exist create and set bal to amount
        giverData.balance = giverData.balance - amount
        success.setDescription(`Gave ${amount.toLocaleString()} to ${Target}`)
        await balSchema.create({ _id: Target.id, balance: amount })
    } else { //Else subtract from giverData balance and add to recipient balance
        giverData.balance = giverData.balance - amount
        data.balance = data.balance + amount
        await data.save()
        success.setDescription(`Gave ${amount.toLocaleString()} to ${Target}`)
    }   //Save giverData balance
    await giverData.save()
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'give',
    aliases: ['share'],
    module: "Economy",
    description: "Give another user an amount.",
    usage: "give [user] [amount]"
}
