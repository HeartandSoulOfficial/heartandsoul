const {discord, MessageEmbed} = require('discord.js')

const PrefixSchema = require('../../Schema/prefixSchema')

module.exports.run = async (client, message, args, gprefix, level) => {
    //Set newprefix to args[0]
    let newprefix = args[0]
    //If new prefix is invalid return invalid prefix
    if(!newprefix) {
        const response = new MessageEmbed()
            .setDescription('Please provide a prefix')
            .setColor('FUCHSIA')
        return message.channel.send({embeds: [response]})
    }//If new prefix length is greater than 5 and doesn't equal current limit prefix size
    if(newprefix.length > 5 && newprefix != 'current') {
        const response = new MessageEmbed()
            .setDescription('Prefix must be less than 5 characters')
            .setColor('BLUE')
        return message.channel.send({embeds: [response]})
    }
    
    //Fetching guild data
    let data = await PrefixSchema.findOne({ _id: message.guild.id })
    // If data doesn't exist
    if(!data) {
        if (args[0] == 'current'){ //If args[0] is equal to current set newprefix to hns
            newprefix = 'hns'
            const response = new MessageEmbed()
                .setDescription(`The prefix for this server is \`${newprefix}\``)
                .setColor('GOLD')
            return message.channel.send({embeds: [response]})
        }//Else create schema and set guild prefix to newprefix
        await PrefixSchema.create({ _id: message.guild.id, newPrefix: newprefix})
        const response = new MessageEmbed()
            .setDescription(`Changed server prefix to \`${newprefix}\``)
            .setColor('GREEN')
        return message.channel.send({embeds: [response]})

    } else if (args[0] === 'current'){ //If data does exist and args[0] is current display current guild prefix
        const response = new MessageEmbed()
            .setDescription(`The prefix for this server is \`${data.newPrefix}\``)
            .setColor('GOLD')
        return message.channel.send({embeds: [response]})

    } else { //Else set data.prefix to new prefix
        try {
            data.newPrefix = newprefix
            //Save data
            await data.save()
            const response = new MessageEmbed()
                .setDescription(`Changed server prefix to \`${newprefix}\``)
                .setColor('GREEN')
            message.channel.send({embeds: [response]})
            } catch(err){
                console.log(err)
            }
    }
}

module.exports.conf = {
    permLevel: "Administrator"
}

module.exports.help = {
    name: 'prefix',
    aliases: [],
    module: "Manager",
    description: "Get or set the command prefix for this server.",
    usage: "prefix [args]"
}