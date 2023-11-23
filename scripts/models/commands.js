let settings = require("../settings/settings.js")

let design = require("../ui/design.js")

let commands = {
    run: function (client, message) {
        if (settings.channels.log !== null && message.author.bot !== true) {
            let logChannel = true
            if (!client.channels.cache.has(settings.channels.log)) {
                	logChannel = false
            }
            if (logChannel === true) {
            	let channel = client.channels.cache.get(settings.channels.log)
            	if (message.attachments.size > 0) {
                	message.attachments.forEach(function (image) {
                	let embed = design.embed("Log", `
             		Author: ${message.author.tag}
                	Content: ${message.content}${settings.channels.log}`, "#00FFF8", image)
                	channel.send(embed)
            		})
            	}
            	else {
            		let embed = design.embed("Log", `
            		Author: ${message.author.tag}
            		Content: ${message.content}`, "#00FFF8", message.attachments)
            		channel.send(embed)
            	}
            }
        }
        if (message.author.bot !== true && message.content.startsWith(settings.prefix) === true) {
            let channel = message.channel
            let member = message.member
            let args = message.content.slice(settings.prefix.length).trim().split(/ +/)
            let command = args.shift().toLowerCase()
            if (command === "commands") {
                let embed = design.embed("Commands",`
                ${settings.prefix}ban @user (reason) [bans a user and provides a reason]

                ${settings.prefix}commands [lists all commands]

                ${settings.prefix}kick @user (reason) [kicks a user and provides a reason]
                
                ${settings.prefix}lock [locks a channel]
                
                ${settings.prefix}open [opens a locked channel]
                
                ${settings.prefix}ping [sends the bot's ping]
                
                ${settings.prefix}prefix (symbol) [changes the bot's prefix]
                
                ${settings.prefix}purge (number from 1 - 99) [deletes recent messages]
                
                ${settings.prefix}setlog [creates a log channel]
                `)
                message.channel.send(embed)
            }
            if (command === "ping") {
                let embed = design.embed("Ping", `The current Ping is ${client.ws.ping}ms.`)
                message.channel.send(embed)
            }
            if (command === "lock") {
                if (!member.hasPermission("MANAGE_CHANNELS")) {
                    let embed = design.embed("Lock", "You do not have the required permissions to run this command.", "#f5261d")
                    return message.channel.send(embed)
                }
                let channel = message.mentions.channels.first() || message.channel
                channel.updateOverwrite(channel.guild.roles.everyone, {
                    SEND_MESSAGES: false
                })
                .then(() => {
                    let embed = design.embed("Lock", `The channel ${channel} has been locked.`)
                    message.channel.send(embed)
                })
                .catch(error => {
                    let embed = design.embed("Lock", "There was an error while trying to lock the channel.", "#f5261d")
                    message.channel.send(embed)
                })
            }
            if (command === "open") {
                if (!member.hasPermission("MANAGE_CHANNELS")) {
                    let embed = design.embed("Open", "You do not have the required permissions to run this command.", "#f5261d")
                    return message.channel.send(embed)
                }
                let channel = message.mentions.channels.first() || message.channel
                channel.updateOverwrite(channel.guild.roles.everyone, {
                    SEND_MESSAGES: true
                })
                .then(() => {
                    let embed = design.embed("Open", `The channel ${channel} has been opened.`)
                    message.channel.send(embed)
                })
                .catch(error => {
                    let emberd = design.embed("Open", "There was an error while trying to open the channel.", "#f5261d")
                    message.channel.send(embed)
                })
            }
            if (command === "purge") {
                if (member.hasPermission("MANAGE_MESSAGES")) {
                    let amount = parseInt(args[0]) + 1
                    if (isNaN(amount)) {
                        let embed = design.embed("Purge", "That does not seem to be a valid number.", "#f5261d")
                        return message.channel.send(embed)
                    } 
                    else if (amount <= 1 || amount > 100) {
                        let embed = design.embed("Purge", "You need to provide a number between 1 and 99.", "#f5261d")
                        return message.channel.send(embed)
                    }
                    channel.bulkDelete(amount, true).catch(err => {
                        let embed = design.embed("Purge", "There was an error trying to purge messages in this channel!", "#f5261d")
                        message.channel.send(embed)
                    })
                } 
                else {
                    let embed = design.embed("Purge", "You do not have the required permissions to run this command.", "#f5261d")
                    message.channel.send(embed)
                }
            }
            if (command === "kick") {
                if (member.hasPermission("KICK_MEMBERS")) {
                    let userToKick = message.mentions.users.first()
                    let reason = args.slice(1).join(" ") || "No reason provided."
                    if (!userToKick) {
                        let embed = design.embed("Kick", "Please mention a user to kick.", "#f5261d")
                        return message.channel.send(embed)
                    }
                    else {
                        let memberToKick = message.guild.member(userToKick)
                        if (!memberToKick.kickable) {
                            let embed = design.embed("Kick", "I cannot kick this user.", "#f5261d")
                            return message.channel.send(embed)
                        }
                        memberToKick.kick(reason)
                        .then(() => {
                            let embed = design.embed("Kick", `${userToKick.tag} was kicked. Reason: ${reason}`) 
                            message.channel.send(embed)
                        })
                        .catch(error => {
                            let embed = design.embed("Kick", `Sorry, I could not kick because of: ${error}`, "#f5261d") 
                            message.channel.send(embed)
                        })
                    }
                }
                if (!member.hasPermission("KICK_MEMBERS")) {
                    let embed = design.embed("Kick", "You do not have the required permissions to run this command.", "#f5261d")
                    message.channel.send(embed)
                }
            }
            if (command === "ban") {
                if (member.hasPermission("BAN_MEMBERS")) {
                    let userToBan = message.mentions.users.first()
                    let reason = args.slice(1).join(" ") || "No reason provided."
                    if (!userToBan) {
                        let embed = design.embed ("Ban", "Please mention a user to ban.", "#f5261d")
                        return message.channel.send(embed)
                    } 
                    else {
                        let memberToBan = message.guild.member(userToBan)
                        if (!memberToBan) {
                            let embed = design.embed("Ban", "That user is not in this guild!", "#f5261d")
                            return message.channel.send(embed)
                        }
                        if (!memberToBan.bannable) {
                            let embed = design.embed("Ban", "I cannot ban this user.", "#f5261d")
                            return message.channel.send(embed)
                        }
                        memberToBan.ban({ reason: reason })
                        .then(() => {
                            let embed = design.embed("Ban", `${userToBan.tag} was banned. Reason: ${reason}`) 
                            message.channel.send(embed)
                        })
                        .catch(error => {
                            let embed = design.embed("Ban", `Sorry, I could not ban because of: ${error}`, "#f5261d") 
                            message.channel.send(embed)
                        })
                    }
                } 
                else {
                    let embed = design.embed("Ban", "You do not have the required permissions to run this command.", "#f5261d")
                    message.channel.send(embed)
                }
            }
            if (command === "setlog") {
                if (!member.hasPermission("MANAGE_CHANNELS")) {
                    let embed = design.embed("Setlog", "You do not have the required permissions to use this command.", "#f5261d")
                    return message.channel.send(embed)
                }
                let logChannelId = args[0]
                let logChannel = message.channel.id
                if (!client.channels.cache.has(logChannel)) {
                    let embed = design.embed("Setlog", "Log channel not found.", "#f5261d")
                    return message.channel.send(embed)
                }
                settings.channels.log = logChannel
                let embed = design.embed("Setlog", `The log channel has been set to <#${logChannel}>.`)
                return message.channel.send(embed)
            }
            if (command === "prefix") {
                if (!member.hasPermission("MANAGE_GUILD")) {
                    let embed = design.embed("Prefix", "You do not have the required permissions to use this command.", "#f5261d")
                    return message.channel.send(embed)
                }
                let newPrefix = args[0]
                if (!newPrefix) {
                    let embed = design.embed ("Prefix", "Please provide a prefix.", "#f5261d")
                    return message.channel.send(embed)
                }
                settings.prefix = newPrefix
                let embed = design.embed("Prefix",`The prefix has been changed to ${settings.prefix}.`)
                return message.channel.send(embed)
            }
        }
    }
}

module.exports = commands
