const {discord, MessageEmbed} = require('discord.js')
const keySchema = require('../../Schema/keySchema')
require('dotenv').config()

module.exports.run = async (client, message, args, gprefix, level) => {

    let random = ((1 << 24) * Math.random() | 0).toString(16) //Random color
    let currentKey = args[1] || random
    let data = await keySchema.findOne({ _id: '493164609591574528' }) //Find data

    if(args[0] == 'set'){
        if(!data){
            await keySchema.create({ _id: '493164609591574528', key: args[1] })
        } else if(data){
            data.key = args[1]
        }
    } else {
        if(!data){
            await keySchema.create({ _id: '493164609591574528', key: random })
        } else if(data){
            if(data.key == args[0]){
                data.key = random
            } else return
        }
    }
    console.log(currentKey)
    message.channel.send(`Changed key to ${currentKey}`).then(m => setTimeout(() => m.delete(), 5000))
    await data.save()
}

module.exports.conf = {
    permLevel: "Bot Owner"
}

module.exports.help = {
    name: 'key',
    aliases: [],
    module: "Manager",
    description: "Change key.",
    usage: "key"
}