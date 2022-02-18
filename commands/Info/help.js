const {discord, MessageEmbed} = require('discord.js')
const {Fix, fixHelp} = require('../../functions')

module.exports.run = async (client, message, args, gprefix, level) => {
    const {container} = client
    let noCmd = new MessageEmbed().setDescription("I couldn't find the command you were looking for.").setColor('FUCHSIA')
    let help = new MessageEmbed().setColor('#98002e');

    if (!args[0]){

        help.setTitle("Command List").setDescription(`Here is the list of commands! \nFor more info on a specific command, use \`${gprefix} help {command}\``)

        let currentCategory = "";
        let helpArray = []
        let cmdArray = []

        const myCommands = container.commands.filter(cmd => container.levelCache[cmd.conf.permLevel] <= level);

        const sorted = myCommands.sort((p, c) => 
            p.help.module > c.help.module ? 1 : p.help.name > c.help.name && p.help.module === c.help.module ? 1 : -1
        )

        sorted.forEach(cmd => {
            cmdArray.push(
                {
                    name: cmd.help.name,
                    module: cmd.help.module
                }
            )
        })

        for(let i=0; i < cmdArray.length; i++){
            const command = cmdArray[i]
            const cat = command.module

            if(currentCategory == '') currentCategory = cat

            if(currentCategory !== cat){
                help.addField(`${currentCategory}`, `${fixHelp(message, helpArray)}`)
                helpArray = []
                currentCategory = cat
            }

            helpArray.push(`\`${command.name}\``)

            if(cmdArray.at(-1).name == command.name){
                let all = helpArray.join(" ")
                help.addField(`${currentCategory}`, `${all}`)
            }
        }
    } else {
        let command = args[0];
        command = container.commands.get(command) ?? container.commands.get(container.aliases.get(command));
        if(command){

            let alias = Fix(command.help.aliases.join(", "))

            if(level < container.levelCache[command.conf.permLevel]) return;
            
            help.setTitle(`Command: ${gprefix}${command.help.name}`).setDescription(`**Aliases: **${alias}\n**Description: ** ${command.help.description}\n**Usage: **${gprefix} ${command.help.usage}`)
        } else return message.channel.send({embeds: [noCmd]})
    }
    message.channel.send({embeds: [help]})
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: "help",
    aliases: [],
    module: 'Info',
    description: "Get bot command list or info.",
    usage: "help (command)"
}