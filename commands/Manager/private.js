const {discord, MessageEmbed} = require('discord.js')
const privSchema = require('../../Schema/privSchema')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix, level) => {
    message.delete()
    const {container} = client
    let unfound = new MessageEmbed().setDescription("I couldn't find the module you were looking for.").setColor('FUCHSIA')
    let success;

    if(!args.length) return message.channel.send({embeds: [unfound]})

    let command = args[0].toLowerCase()
    command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));
    if(command){
        command = command.help.name.toLowerCase()
    }
    let moduleName = args[0][0].toUpperCase() + args[0].slice(1)
    let cmdArray = [moduleName]

    const filCommands = container.commands.filter(cmd => cmd.help.module === moduleName)

    filCommands.forEach(cmd => {
        cmdArray.push(cmd.help.name.toLowerCase())
    });

    let privated = command || cmdArray

    if(!privated) console.log(privated)

    if(!command && cmdArray.length < 2) return message.channel.send({embeds: [unfound]}).then(m => setTimeout(() => m.delete(), 5000))

    let data = await privSchema.findOne({ _id: '493164609591574528' }) //Find data
    if(!data){
        await privSchema.create({ _id: '493164609591574528', priv: privated })
        return message.channel.send(`Privated ${privated}`).then(m => setTimeout(() => m.delete(), 5000))
    }
    if(privated == args[0].toLowerCase()){
        if(!data.priv.includes(privated)){
            data.priv.push(privated)
            success = `Privated ${privated}`
        } else if(data.priv.includes(privated)){
            let name = data.priv.indexOf(privated)
            data.priv.splice(name, 1)
            success = `Unprivated ${privated}`
        }
    } else {
        if(!data.priv.includes(moduleName.toLowerCase())){
            cmdArray.forEach(cmd => {
                if(!data.priv.includes(cmd)){
                    data.priv.push(cmd.toLowerCase())
                }
            })
            success = `Privated ${moduleName}`
        } else if(data.priv.includes(moduleName.toLowerCase())){
            cmdArray.forEach(cmd => {
                let command = data.priv.indexOf(cmd.toLowerCase())
                data.priv.splice(command, 1)
            })
            let name = data.priv.indexOf(moduleName)
            data.priv.splice(name, 1)
            success = `Unprivated ${moduleName}`
        }
    }
    await data.save()
    return message.channel.send(success).then(m => setTimeout(() => m.delete(), 5000))
}

module.exports.conf = {
    permLevel: "Bot Owner"
}

module.exports.help = {
    name: 'private',
    aliases: ['testing', 'priv', 'hide'],
    module: "Manager",
    description: "Private a command or module",
    usage: "priv [command/module]"
}