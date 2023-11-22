let Discord = require("discord.js")

let config = require("../root/config.js")

let commands = require("./models/commands.js")

let bot = {
    client: new Discord.Client(),
    run: function () {
        console.log("[bot.js] Running bot.run()...")
        this.events()
    },
    events: function () {
        this.client.on("ready", () => {
            console.log(`Logged in as ${this.client.user.tag}!`)
        })
        this.client.on("message", (message) => {
            commands.run(bot.client, message)
        })
        this.client.login(config.token)
    }
}

module.exports = bot