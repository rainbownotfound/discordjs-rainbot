const sqlite = require('sqlite');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../../utils.js');
sql.open('./warnings.sqlite');

module.exports.run = (client, message, args) => {
    if(!message.member.hasPermission("ADMINISTRATOR") && !message.member.hasPermission("MANAGE_GUILD")) {
        message.channel.send({
            embed: utils.embed(`Error!`, `You cannot wipe the warnings, since you are not a Moderator!`)
        });
    } else {
        sql.all(`SELECT * FROM warnings`).then(row => {
            sql.run(`DELETE FROM warnings`);

            message.channel.send(`Hey @everyone! ${message.author.username} has just wiped all warnings! You are all clean now!`);
        });
    }
};

module.exports.help = {
    command: 'warnwipe',
    usage: 'r.wipewarn',
    category: 'Moderator',
    description: 'Wipe all warnings from the database!'
};