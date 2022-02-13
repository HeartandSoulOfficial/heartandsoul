module.exports.run = async (client, message, args, gprefix) => {
    message.channel.send("Ping!").then(m =>{ //Sends Ping!
        let ping = Date.now() - m.createdTimestamp //Edits from current time minus message created time
        m.edit(`Pong! \`${ping}ms\``) //Edits message to current ping
    })
}

module.exports.help = {
    name: 'ping',
    aliases: ['pong','ms'],
    permLevel: "User"
}