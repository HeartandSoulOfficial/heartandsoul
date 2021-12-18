const Discord = require('discord.js')

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const prefix = 'hns'

require('dotenv').config();



client.on("messageCreate", message => {
    if (message.content === `${prefix}ping`)
        message.channel.send("Ping!").then(m =>{
            let ping =m.createdTimestamp - message.editedTimestamp
            m.edit(`Pong! \`${ping}ms\``)
    })
})
client.on('ready', () => {
    console.log('Ready')
})

client.login(process.env.TOKEN)