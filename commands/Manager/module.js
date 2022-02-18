const {discord, MessageEmbed} = require('discord.js')
const commandSchema = require('../../Schema/commandSchema')

module.exports.run = async (client, message, args, gprefix, level) => {
    let noMod = new MessageEmbed().setDescription("I couldn't find the module you were looking for.").setColor('FUCHSIA')
    let success = new MessageEmbed().setColor('GREEN')

    const {container} = client

    if(!args.length) return message.channel.send({embeds: [noMod]})

    args = args[0].toLowerCase()
    let moduleName = args[0].toUpperCase() + args.slice(1)
    let cmdArray = [moduleName]

    const myCommands = container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level);
    const filCommands = myCommands.filter(cmd => cmd.help.module == moduleName);

    filCommands.forEach(cmd => {
        if(cmd.help.name != 'help' && cmd.help.name != 'command' && cmd.help.name != 'module'){
            cmdArray.push(cmd.help.name.toLowerCase())
        }
    });

    if(cmdArray.length < 2) return message.channel.send({embeds: [noMod]})

    let data = await commandSchema.findOne({ _id: message.guild.id })

    if(!data){
        await commandSchema.create({ _id: message.guild.id, disabled: cmdArray })
        success.setDescription(`Disabled \`${moduleName}\` for this server.`)
        return message.channel.send({embeds: [success]})
    }
    if(!data.disabled.includes(moduleName)){
        filCommands.forEach(cmd => {
            if(cmd.help.name != 'help' && cmd.help.name != 'command' && cmd.help.name != 'module'){
                if(!data.disabled.includes(cmd.help.name)){
                    data.disabled.push(cmd.help.name.toLowerCase())
                }
            }
        })
        data.disabled.push(moduleName)
        success.setDescription(`Disabled \`${moduleName}\` for this server.`)
    } else if(data.disabled.includes(moduleName)){
        filCommands.forEach(cmd => {
            let command = data.disabled.indexOf(cmd.help.name.toLowerCase())
            data.disabled.splice(command, 1)
        })
        let name = data.disabled.indexOf(moduleName)
        data.disabled.splice(name, 1)
        success.setDescription(`Enabled \`${moduleName}\` for this server.`)
    }
    await data.save()
    message.channel.send({embeds: [success]})
}

module.exports.conf = {
    permLevel: 'Administrator'
}

module.exports.help = {
    name: 'module',
    aliases: ['category'],
    module: "Manager",
    description: 'Enable or disable all commands in a module.',
    usage: "module [name]"
}