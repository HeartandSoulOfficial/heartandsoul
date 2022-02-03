const Discord = require('discord.js')

const {Intents} = require('discord.js');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const fs = require('fs')

const prefix = 'hns'
const ms = require('parse-ms')
require('./mongo')()

const PrefixSchema = require('./Schema/prefixSchema')

require('dotenv').config();

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdirSync('./commands/').forEach(dir => {
    fs.readdir(`./commands/${dir}`, (err, files) => {
        if (err) throw err;

        var jsFiles = files.filter(f => f.split('.').pop() === 'js')
        if (jsFiles.length <= 0) return console.log("Can't find any commands!")

        jsFiles.forEach(file => {
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`[Command Handler] - File ${file} was loaded`)
            try {
                client.commands.set(fileGet.help.name, fileGet)
                if(fileGet.help.aliases == undefined){
                    return
                } else {
                    fileGet.help.aliases.forEach(alias => {
                        client.aliases.set(alias, fileGet.help.name)
                    })
                }
            } catch (err) {
                return console.log(err)
            }
        })
    })
})

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type == 'DM') return
    let messageArray
    let args;
    let cmd;
    let gprefix;
    let commands;
    let mprefix = message.mentions.users.first()
    //Finds guild prefix
    let data = await PrefixSchema.findOne({
        _id: message.guild.id
    })
    //If mentions bot
    if (mprefix){
        if(mprefix.id == '920885512208793652'){
            gprefix = '<@!920885512208793652>'
        }
    }
    //If found and starts with prefix set to guild prefix else global
     else if(data){
        if(message.content.startsWith(data.prefix)){
            gprefix = data.newPrefix
        }
    }
    gprefix = gprefix || 'hns'
    //Splits message content into command name and args
    messageArray = message.content.split(gprefix).join("").trim().split(" ")
    args = messageArray.slice(1)
    cmd = messageArray[0]

    commands = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd))
    if(commands){ 
        if(!message.content.startsWith(gprefix)) return
        commands.run(client, message, args, gprefix)}
})

client.on('ready', () => {
    console.log('Ready')
})

client.login(process.env.TOKEN)