let Discord = require("discord.js")

let settings = require("../settings/settings.js")

let design = {
    embed: function (title, description, color = "#00FFF8", image = null) {
        let embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle(`**__${title}__**`)
        .setDescription(`${description}`)
        .setTimestamp()
        .setFooter(`©${settings.creator}`)
        .setThumbnail("https://cdn.discordapp.com/attachments/1176213636625207337/1176823890979336202/IMG_1072.gif?ex=657045a7&is=655dd0a7&hm=e2893543ecd7d2ee38e15530e30598dc47b6c4b5dffb3ec04750ad89c2cc9783&")
        if (image !== null) {
            embed.setImage(image.url)
        }
        return embed
    }
}

module.exports = design