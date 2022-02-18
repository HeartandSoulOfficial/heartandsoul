module.exports.run = async (client, message, args, gprefix, level) => {
    message.channel.send("Ping!").then(m =>{ //Sends Ping!
        let ping = Date.now() - m.createdTimestamp //Edits from current time minus message created time
        m.edit(`Pong! \`${ping}ms\``) //Edits message to current ping
    })
}

module.exports.conf = {
    permLevel: "User"
}

module.exports.help = {
    name: 'ping',
    aliases: ['pong','ms'],
    module: "Info",
    description: "Get bot ping.",
    usage: "ping"
}