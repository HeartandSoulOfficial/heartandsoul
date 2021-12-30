module.exports.run = async (client, message, args, gprefix) => {
    message.channel.send("Ping!").then(m =>{
        let ping =m.createdTimestamp - message.editedTimestamp
        m.edit(`Pong! \`${ping}ms\``)
    })
}

module.exports.help = {
    name: 'ping'
}