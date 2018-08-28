const utils = require("../../utils.js")

module.exports.run = (client, message, args) => {
    message.channel.send({
        embed: utils.embed(`Pong!`, `Latency is ${Math.round(client.ping)}ms`)
    });
};

module.exports.help = {
    command: 'ping',
    usage: 'r.ping',
    category: 'Utility',
    description: 'Pings the bot'
};
