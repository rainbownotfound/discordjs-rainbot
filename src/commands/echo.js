const Discord = require("discord.js")
const utils = require('../../utils.js')

module.exports.run = (client, message, args) => {
    const echomsg = args.join(" ")
    if(message.content.includes('@')) { 
        message.channel.send("No tagging please!")
    } else {
        message.channel.send(echomsg)
    }
};

module.exports.help = {
    command: 'echo',
    usage: 'r.echo <message>',
    category: 'Fun',
    description: 'the bot echos whatever you want it to'
};
