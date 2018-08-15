const utils = require("../../utils.js")

module.exports.run = (client, message, args) => {
    message.reply(utils.randomColor())
};

module.exports.help = {
    command: 'randomcolor',
    usage: 'r.randomcolor',
    category: 'Utility',
    description: 'returns random RGB values'
};