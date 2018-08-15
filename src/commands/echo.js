const utils = require('../../utils.js')

module.exports.run = (client, message, args) => {
    const echomsg = args.join(" ")
    message.channel.send(echomsg)
};

module.exports.help = {
    command: 'echo',
    usage: 'r.echo <message>',
    category: 'Fun',
    description: 'the bot echos whatever you want it to'
};