const utils = require('')

module.exports.run = (client, message, args) => {
    const echomsg = args.join(" ")
    message.channel.send(echomsg)
};

module.exports.help = {
    command: 'echo',
    usage: 'echo <message>',
    category: 'fun',
    description: 'the bot echos whatever you want it to'
};