const {discord, MessageEmbed} = require('discord.js')

const PrefixSchema = require('../../Schema/prefixSchema')

module.exports.run = async (client, message, args, gprefix) => {

    if(!message.content.startsWith(gprefix)) return

    if(!message.member.permissions.has('ADMINISTRATOR')) {
        const response = new MessageEmbed()
            .setDescription('You don\'t have permissions to use this command')
            .setColor('RED')
        return message.channel.send({embeds: [response]})
    }
    let newprefix = args[0]

    if(!newprefix) {
        const response = new MessageEmbed()
            .setDescription('Please provide a prefix')
            .setColor('FUCHSIA')
        return message.channel.send({embeds: [response]})
    }
    if(newprefix.length > 5 && newprefix != 'current') {
        const response = new MessageEmbed()
            .setDescription('Prefix must be less than 5 characters')
            .setColor('BLUE')
        return message.channel.send({embeds: [response]})
    }
    if(newprefix.length <= 5 && newprefix.length > 3 && newprefix.startsWith('hns') && newprefix != 'current'){
        const response = new MessageEmbed()
        .setDescription('Please provide a valid prefix')
        .setColor('FUCHSIA')
    return message.channel.send({embeds: [response]})
    }
    
    // getting the data/schema from the database
    let data = await PrefixSchema.findOne({ _id: message.guild.id })
    // if there is not data/schema create one
    if(!data) {
        if (args[0] == 'current'){
            newprefix = 'hns'
            const response = new MessageEmbed()
                .setDescription(`The prefix for this server is \`${newprefix}\``)
                .setColor('GOLD')
            return message.channel.send({embeds: [response]})
        }
        await PrefixSchema.create({ _id: message.guild.id, newPrefix: newprefix})
        const response = new MessageEmbed()
            .setDescription(`Changed server prefix to \`${newprefix}\``)
            .setColor('GREEN')
        return message.channel.send({embeds: [response]})

    } else if (args[0] === 'current'){
        const response = new MessageEmbed()
            .setDescription(`The prefix for this server is \`${data.newPrefix}\``)
            .setColor('GOLD')
        return message.channel.send({embeds: [response]})

    } else {
        try {
            data.newPrefix = newprefix
            // saving the data now
            await data.save()
            //sending the success message
            const response = new MessageEmbed()
                .setDescription(`Changed server prefix to \`${newprefix}\``)
                .setColor('GREEN')
            message.channel.send({embeds: [response]})
            } catch(err){
                console.log(err)
            }
    }
}
module.exports.help = {
    name: 'prefix'
}