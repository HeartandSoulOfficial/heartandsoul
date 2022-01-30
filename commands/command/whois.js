const {discord, MessageEmbed, MessageFlags} = require('discord.js')
const moment = require('moment')

module.exports.run = async (client, message, args, gprefix) => {
    let userID = args[0]
    let Target = message.mentions.users.first()
    try{
        if(Target){
        let roleList = [];
        let roleCount = []
        let roleColor;

        let Member = await message.guild.members.fetch(Target.id)
        console.log(Member)
        Member._roles.map(r => roleCount.push(r));
        Member._roles.map(r => roleList.push("<@&" + r + ">")).reverse().join(" ")
        
        if (roleCount.length < 1) roleColor = '000000';
        else {
            let topRole = await message.guild.roles.fetch(`${roleCount.reverse()[0]}`)
            roleColor = topRole.color.toString(16)
        }
        if (roleList.length < 1) roleList = "None";
        else {
            roleList = roleList.reverse().join(" ")
        }
        const response = new MessageEmbed()
            .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
            .setThumbnail(Target.displayAvatarURL({dynamic: true}))
            .setDescription(`<@!${Target.id}>`)
            .addField("Joined", `${moment(Member.joinedAt).format('MMM D, YYYY h:mma')}`)
            .addField(`Roles [${roleCount.length}]`, `${roleList}`)
            .setColor(`#${roleColor}`)
            .setFooter({text: Target.id})
            .setTimestamp()
        message.channel.send({embeds: [response]})
        }
        else if(!Target && args.length == 1) {
            try {
                let Target = await message.guild.members.fetch(userID)
                let roleList = [];
                let roleCount = []
                let roleColor;
    
                let Member = await message.guild.members.fetch(Target.id)
    
                Member._roles.map(r => roleCount.push(r));
                Member._roles.map(r => roleList.push("<@&" + r + ">")).reverse().join(" ")
                
                if (roleCount.length < 1) roleColor = '000000';
                else {
                    let topRole = await message.guild.roles.fetch(`${roleCount.reverse()[0]}`)
                    roleColor = topRole.color.toString(16)
                }
                if (roleList.length < 1) roleList = "None";
                else {
                    roleList = roleList.reverse().join(" ")
                }
                const response = new MessageEmbed()
                    .setAuthor({name: Target.user.username, iconURL: Target.user.displayAvatarURL({dynamic: true})})
                    .setThumbnail(Target.user.displayAvatarURL({dynamic: true}))
                    .setDescription(`<@!${Target.user.id}>`)
                    .addField("Joined", `${moment(Target.joinedAt).format('MMM D, YYYY h:mma')}`)
                    .addField(`Roles [${roleCount.length}]`, `${roleList}`)
                    .setColor(`#${roleColor}`)
                    .setFooter({text: Target.user.id})
                    .setTimestamp()
                message.channel.send({embeds: [response]})
            } catch(err){
                console.log(err)
                message.reply(`Couldn't find user ${args}`)
            }
        }
        else{
            Target = message.member.user
            let roleList = [];
            let roleCount = []
            let roleColor;

            let Member = await message.guild.members.fetch(Target.id)
            Member._roles.map(r => roleCount.push(r));
            Member._roles.map(r => roleList.push("<@&" + r + ">"))
            
            if (roleCount.length < 1) roleColor = '000000';
            else {
                let topRole = await message.guild.roles.fetch(`${roleCount.reverse()[0]}`)
                roleColor = topRole.color.toString(16)
            }
            if (roleList.length < 1) roleList = "None";
            else {
                roleList = roleList.reverse().join(" ")
            }
            const response = new MessageEmbed()
                .setAuthor({name: Target.username, iconURL: Target.displayAvatarURL({dynamic: true})})
                .setThumbnail(Target.displayAvatarURL({dynamic: true}))
                .setDescription(`<@!${Target.id}>`)
                .addField("Joined", `${moment(Member.joinedAt).format('MMM D, YYYY h:mma')}`)
                .addField(`Roles [${roleCount.length}]`, `${roleList}`)
                .setColor(`#${roleColor}`)
                .setFooter({text: Target.id})
                .setTimestamp()
            message.channel.send({embeds: [response]})
        }
    } catch(err){
        console.log(err)
    }/* finally{
    else if(!Target) {
        client.users.fetch(userID).then(user => {
            const response = new MessageEmbed()
            .setAuthor(user.username + " ID success")
            .setThumbnail(user.displayAvatarURL({dynamic: true}))
            .setColor('#143ae7')
            .addField("User ID", user.id)
            message.channel.send({embeds: [response]})
        })
        .catch(message.channel.send("Error"))
    }
    else{
        Target = message.member.user
        const response = new MessageEmbed()
        .setAuthor(Target.username + " Last Resort")
        .setThumbnail(Target.displayAvatarURL({dynamic: true}))
        .setColor('#143ae7')
        .addField("User ID", Target.id)
        message.channel.send({embeds: [response]})
    }
}*/
    /*|| client.users.cache.get(userID)|| message.member.user*/
    /*|| message.guild.members.cache.get(args[0])*/
/*    try{
    console.log(await message.guild.members.fetch({user, force: true}).then(user => {const Target = user.first()}))
    console.log("Next")
    console.log(message.member.user)
    } catch (err){
        console.log(err)
    }*/
    /*const member = message.guild.members.cache.get(Target.id)*/
    /*const response = new MessageEmbed()
    .setAuthor(Target.username)
    .setThumbnail(Target.displayAvatarURL({dynamic: true}))
    .setColor('#143ae7')
    .addField("User ID", Target.id)
    message.channel.send({embeds: [response]})*/
}

module.exports.help = {
    name: "whois"
}