const {MessageEmbed} = require('discord.js')
const PrefixSchema = require('../Schema/prefixSchema')
const config = require('../config')
const permlevel = require('../functions')

module.exports = async (client, message) => {
    const { container } = client
    const level = permlevel(message);
    let mprefix = message.mentions.users.first();
    let gprefix;
    let messageArray;
    let args;
    let cmd;
    let commands;

    const deny = new MessageEmbed()
        .setDescription('You don\'t have permissions to use this command')
        .setColor('RED')

    if (message.author.bot || message.channel.type == 'DM') return

    let data = await PrefixSchema.findOne({
        _id: message.guild.id
    })

    if (mprefix){
        if(mprefix.id == '920885512208793652'){
            gprefix = '<@!920885512208793652>'
        }
    }
    else if(data){
        if(message.content.startsWith(data.newPrefix)){
            gprefix = data.newPrefix
        }
    }
    gprefix = gprefix || 'hns'

    messageArray = message.content.split(gprefix).join("").trim().split(" ")
    args = messageArray.slice(1)
    cmd = messageArray[0]

    commands = container.commands.get(cmd) || container.commands.get(container.aliases.get(cmd))

    if (!commands) return;

    if (level < container.levelCache[commands.help.permLevel]) {
        return message.channel.send({embeds: [deny]})
    }
    try {
        commands.run(client, message, args, gprefix)
    } catch (err){
        console.error(err)
        message.channel.send({ content: `There was a problem with your request.\n\`\`\`${err.message}\`\`\`` })
        .catch(err => console.error("An error occurred replying on an error", err));
    }

}