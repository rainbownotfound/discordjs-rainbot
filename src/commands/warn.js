const sqlite = require('sqlite');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../../utils');
sqlite.open('./warnings.sqlite');

module.exports.run = (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_GUILD") && !message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send({
            embed: utils.embed(`Error!`, `You are not a Moderator!`, [], {
                color: "#ff0000"
            })
        });
    } else {
    if(args.length < 1) {
        message.channel.send({
            embed: utils.embed(`Error!`, `I couldn't find this member!`, [], {
                color: "#ff0000"
            })
        });
    }

    const warnedUser = message.mentions.users.first().id;
    const reason = args.slice(1).join(" ");

    if(!reason) {
        message.channel.send({
            embed: utils.embed(`Error!`, `You need to specify a reason to warn this person!`, [], {
                color: "#ff0000"
            })
        });
    } else {
        const warnID = () => {
            return utils.randomSelection([
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
                'g',
                'h',
                'i',
                'j',
                'k',
                'l',
                'm',
                'n',
                'o',
                'p',
                'q',
                'r',
                's',
                't',
                'u',
                'v',
                'w',
                'x',
                'y',
                'z',
                'A',
                'B',
                'C',
                'D',
                'E',
                'F',
                'G',
                'H',
                'I',
                'J',
                'K',
                'L',
                'M',
                'N',
                'O',
                'P',
                'Q',
                'R',
                'S',
                'T',
                'U',
                'V',
                'W',
                'X',
                'Y',
                'Z',
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '0'
            ]);
        };

        const finalWarnID = `${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}${warnID()}`

        sqlite.get(`SELECT * FROM warnings`).then(row => {
            if(!row) {
            /** if(warnedUser === "325951812991451137") {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You can't warn the Owner, silly!`, [], {
                        color: "#ff0000"
                    })
                });
            } else if (warnedUser === "455064886754672642") {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You can't warn Demi!`, [], {
                        color: "#ff0000"
                    })
                });
            } else { **/
                sqlite.run(`INSERT INTO warnings (warnedID, modID, warnID, reason, appeal, appealReason) VALUES (?, ?, ?, ?, ?, ?)`, [warnedUser, message.author.id, finalWarnID, reason, 'No Appeal Created', 'No Appeal Created']);

                message.channel.send({
                    embed: utils.embed(`Warn System`, `**${client.users.get(warnedUser).tag}** has been warned.`)
                });

                client.fetchUser(message.author.id).then(user => {
                    user.send({
                        embed: utils.embed(`Warn System`, stripIndents`
                        You have issued a new warning!
                        Here are the details:
                        \`\`\`asciidoc
                        Moderator :: ${message.author.tag}
                        Warning :: ${client.users.get(warnedUser).tag}
                        Warn ID :: ${finalWarnID}
                        \`\`\`

                        Users are able to request a warn appeal. These will be logged in <#487377071677636618>, and you will be notified by DM.
                        `)
                    });
                });

                client.fetchUser(warnedUser).then(user => {
                    user.send({
                        embed: utils.embed(`You Have Been Warned!`, `You have been warned by **${message.author.tag}** for **${reason}**\nWarn ID: ${finalWarnID}\n\nNot a valid reason? You can always request an appeal with \`r.warnappeal\`\nMake sure to use the 10-digit ID given with this warning!`)
                    });
                });
            // }
            } else {
                /** if(warnedUser === "325951812991451137") {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You can't warn the Owner, silly!`, [], {
                        color: "#ff0000"
                    })
                });
            } else if (warnedUser === "455064886754672642") {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You can't warn Demi!`, [], {
                        color: "#ff0000"
                    })
                });
            } else { **/
                sqlite.run(`INSERT INTO warnings (warnedID, modID, warnID, reason, appeal, appealReason) VALUES (?, ?, ?, ?, ?, ?)`, [warnedUser, message.author.id, finalWarnID, reason, 'No Appeal Created', 'No Appeal Created']);

                message.channel.send({
                    embed: utils.embed(`Warn System`, `**${client.users.get(warnedUser).tag}** has been warned.`)
                });

                client.fetchUser(message.author.id).then(user => {
                    user.send({
                        embed: utils.embed(`Warn System`, stripIndents`
                        You have issued a new warning!
                        Here are the details:
                        \`\`\`asciidoc
                        Moderator :: ${message.author.tag}
                        Warning :: ${client.users.get(warnedUser).tag}
                        Warn ID :: ${finalWarnID}
                        \`\`\`

                        Users are able to request a warn appeal. These will be logged in <#487377071677636618>, and you will be notified by DM.
                        `)
                    });
                });

                client.fetchUser(warnedUser).then(user => {
                    user.send({
                        embed: utils.embed(`You Have Been Warned!`, `You have been warned by **${message.author.tag}** for **${reason}**\nWarn ID: ${finalWarnID}\n\nNot a valid reason? You can always request an appeal with \`r.warnappeal\`\nMake sure to use the 10-digit ID given with this warning!`)
                    });
                });
            // }
            }
        }).catch(() => {
            console.error;
            sqlite.run(`CREATE TABLE IF NOT EXISTS warnings (warnedID TEXT, modID TEXT, warnID TEXT, reason TEXT, appeal TEXT, appealReason TEXT)`).then(() => {
                sqlite.run(`INSERT INTO warnings (warnedID, modID, warnID, reason, appeal, appealReason) VALUES (?, ?, ?, ?, ?, ?)`, [warnedUser, message.author.id, finalWarnID, reason, 'No Appeal Created', 'No Appeal Created']);

                message.channel.send({
                    embed: utils.embed(`Warn System`, `**${client.users.get(warnedUser).tag}** has been warned.`)
                });

                client.fetchUser(message.author.id).then(user => {
                    user.send({
                        embed: utils.embed(`Warn System`, stripIndents`
                        You have issued a new warning!
                        Here are the details:
                        \`\`\`asciidoc
                        Moderator :: ${message.author.tag}
                        Warning :: ${client.users.get(warnedUser).tag}
                        Warn ID :: ${finalWarnID}
                        \`\`\`

                        Users are able to request a warn appeal. These will be logged in <#487377071677636618>, and you will be notified by DM.
                        `)
                    });
                });

                client.fetchUser(warnedUser).then(user => {
                    user.send({
                        embed: utils.embed(`You Have Been Warned!`, `You have been warned by **${message.author.tag}** for **${reason}**\nWarn ID: ${finalWarnID}\n\nNot a valid reason? You can always request an appeal with \`r.warnappeal\`\nMake sure to use the 10-digit ID given with this warning!`)
                    });
                });
            });
        });
    }
}
};

module.exports.help = {
    command: 'warn',
    usage: 'r.warn <user> <reason>',
    category: 'Moderator',
    description: 'Warn a user upon breaking the rules.'
};