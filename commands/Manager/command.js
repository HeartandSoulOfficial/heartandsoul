const {discord, MessageEmbed} = require('discord.js')
const commandSchema = require('../../Schema/commandSchema')

module.exports.run = async (client, message, args, gprefix, level) => {
    let noCmd = new MessageEmbed().setDescription("I couldn't find the command you were looking for.").setColor('FUCHSIA')
    let success = new MessageEmbed().setColor('GREEN')

    const {container} = client
    let command = args[0]

    command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));

    if(command) {
        if(level < container.levelCache[command.conf.permLevel]) return;
    }
    if(!command || !args.length) return message.channel.send({embeds: [noCmd]})

    args = args[0].toLowerCase()
    command = command.help.name.toLowerCase()
    
    if(command == 'help' || command == 'command') return

    let data = await commandSchema.findOne({ _id: message.guild.id }) //Find data

    if(!data){
        await commandSchema.create({ _id: message.guild.id, disabled: [command] })
        success.setDescription(`Disabled \`${command}\` for this server.`)
        return message.channel.send({embeds: [success]})
    }
    if(!data.disabled.includes(args)){
        data.disabled.push(command)
        success.setDescription(`Disabled \`${command}\` for this server.`)
    } else if(data.disabled.includes(args)){
        let cmd = data.disabled.indexOf(args)
        data.disabled.splice(cmd, 1)
        success.setDescription(`Enabled \`${command}\` for this server.`)
    }
    await data.save()
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Administrator'
}

module.exports.help = {
    name: 'command',
    aliases: ['cmd'],
    module: "Manager",
    description: 'Enable or disable a command.',
    usage: "command [name]"
}