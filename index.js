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

/*client.on('messageCreate', message => {
    if (message.content === `${prefix}invite`)
        message.reply("Here is our invite link:\nhttps://discord.com/oauth2/authorize?client_id=920885512208793652&permissions=415068712000&scope=bot")
})*/

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
            } catch (err) {
                return console.log(err)
            }
        })
    })
})

/*
const Discord = require('discord.js')

const ntents = new Discord.Intents(32767)

class Client extends Discord.Client {
    constructor(options) {
        super({intents})
    }
}*/

client.on('messageCreate', async message => {
    if(message.author.bot || message.channel.type == 'DM') return

    let messageArray = message.content.split(" ")
    let cmd = messageArray[0]
    let args = messageArray.slice(1)

    let gprefix;
    let commands;

    let data = await PrefixSchema.findOne({
        _id: message.guild.id
    })
    if (message.content.startsWith('hns')){
        gprefix = 'hns'
    }
    else {
        if (data === null){
            gprefix = 'hns'
        } else {
            if (data.newPrefix === undefined){
                gprefix = 'hns'
            }
            else {
            gprefix = data.newPrefix
            }
        }
    }
    commands = client.commands.get(cmd.slice(gprefix.length))
    if(commands){ 
        if(!message.content.startsWith(gprefix)) return
        commands.run(client, message, args, gprefix)}
})

client.on('ready', () => {
    console.log('Ready')
})

/*fs.readdirSync('./commands/')
    .filter(file => file.endsWith('.js'))
    .forEach(file => {
        const command = require(`./commands/${file}`)
        console.log(`Command ${command.name} loaded`)
        client.commands.set(command.name, command)
    })
*/
/*fs.readdirSync('./commands/').forEach(dir => {

    fs.readdir(`./commands/${dir}`, (err, files) => {

        if (err) throw err;

        var jsFiles = files.filter(f => f.split('.').pop() === 'js')

        if (jsFiles.length <= 0){
        console.log("No commands found.");
        }

        jsFiles.forEach(file => {
            var fileGet = require(`./commands/${dir}/${file}`);
            console.log(`File ${file} was loaded`)

            try {
                client.commands.set(fileGet.help.name, fileGet);
            } catch (err) {
                return console.log(err)
            }

        })
    })
})*/

client.login(process.env.TOKEN)