module.exports.run = async (client, message, args, gprefix) => {
    message.channel.send("Ping!").then(m =>{
        let ping =Date.now() - m.createdTimestamp
        m.edit(`Pong! \`${ping}ms\``)
    })
}

module.exports.help = {
    name: 'ping',
    aliases: ['pong','ms'],
    permLevel: "User"
}