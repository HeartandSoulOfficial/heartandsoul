const Discord = require('discord.js')
const {Intents} = require('discord.js');
const fs = require('fs')
const { permLevels } = require('./config');

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

require('./mongo')()
require('dotenv').config();

const commands = new Discord.Collection();
const aliases = new Discord.Collection();
const levelCache = {}

//Caching Perm Levels
for (let i of permLevels) {
    const thisLevel = i;
    levelCache[thisLevel.name] = thisLevel.level;
}

//Client Container
client.container = {
    commands,
    aliases,
    levelCache
}

const init = async () => {
    //Command Handler
    fs.readdirSync('./commands/').forEach(dir => {
        fs.readdir(`./commands/${dir}`, (err, files) => {
            if (err) throw err;
    
            var jsFiles = files.filter(f => f.split('.').pop() === 'js')
            if (jsFiles.length <= 0) return console.log("Can't find any commands!")
    
            jsFiles.forEach(file => {
                var fileGet = require(`./commands/${dir}/${file}`);
                console.log(`\n[Command Handler] - File ${file} was loaded`)
                try {
                    client.container.commands.set(fileGet.help.name, fileGet)
                    if(!fileGet.help.aliases) return
                    let aliasList = [];
                    fileGet.help.aliases.forEach(alias => {
                        aliasList.push(alias)
                        client.container.aliases.set(alias, fileGet.help.name)
                    })
                        console.log(`[ALIASES] - ${aliasList.join(", ")}`)
                } catch (err) {
                    return console.log(err)
                }
            })
        })
    })
    //Event Handler
    const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
      const eventName = file.split(".")[0];
      const event = require(`./events/${file}`);

      client.on(eventName, event.bind(null, client));
      console.log(`[EVENT HANDLER] - File ${eventName} was loaded`);
    }
    //Login client
    client.login(process.env.TOKEN)
}
//Instantiate init function
init()