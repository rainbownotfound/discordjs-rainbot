const sql = require('sqlite');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../../utils');
sql.open('./warnings.sqlite');

module.exports.run = (client, message, args) => {
    if(!message.member.hasPermission("MANAGE_GUILD") && !message.member.hasPermission("ADMINISTRATOR")) {
        message.channel.send({
            embed: utils.embed(`Error!`, `You are not a Moderator!`, [], {
                color: "#ff0000"
            })
        });
    } else {
        const action = args[0];

        if(!action) {
            sql.all(`SELECT * FROM warnings`).then(rows => {
                var data_content = rows.map(r => stripIndents`
                \`\`\`asciidoc
                User :: ${client.users.get(r.warnedID).tag} (${r.warnedID})
                Moderator :: ${client.users.get(r.modID).tag} (${r.modID})
                Warning ID :: ${r.warnID}
                Reason :: ${r.reason}
                Appeal Status :: ${r.appeal}
                \`\`\`
                `).join('\n');

                message.channel.send({
                    embed: utils.embed(`Total Warnings: ${rows.length}`, `${data_content}`)
                });
            });
        } else if (action === "from:mod") {
            const modUser = client.users.get(args[1]).id;
            sql.all(`SELECT * FROM warnings WHERE modID = "${modUser}"`).then(rows => {
                var data_content = rows.map(r => stripIndents`
                \`\`\`asciidoc
                User :: ${client.users.get(r.warnedID).tag} (${r.warnedID})
                Moderator :: ${client.users.get(r.modID).tag} (${r.modID})
                Warning ID :: ${r.warnID}
                Reason :: ${r.reason}
                Appeal Status :: ${r.appeal}
                \`\`\`
                `).join('\n');

                message.channel.send({
                    embed: utils.embed(`Total Warnings From Moderator ${client.users.get(modUser).tag}: ${rows.length}`, `${data_content}`)
                });
            });
        } else if (action === "to:user") {
            const warnedUser = client.users.get(args[1]).id;
            sql.all(`SELECT * FROM warnings WHERE warnedID = "${warnedUser}"`).then(rows => {
                var data_content = rows.map(r => stripIndents`
                \`\`\`asciidoc
                User :: ${client.users.get(r.warnedID).tag} (${r.warnedID})
                Moderator :: ${client.users.get(r.modID).tag} (${r.modID})
                Warning ID :: ${r.warnID}
                Reason :: ${r.reason}
                Appeal Status :: ${r.appeal}
                \`\`\`
                `).join('\n');

                message.channel.send({
                    embed: utils.embed(`Total Warnings For ${client.users.get(warnedUser).tag}: ${rows.length}`, `${data_content}`)
                });
            });
        } else {
            const warningID = args[0];
            sql.get(`SELECT * FROM warnings WHERE warnID = "${warningID}"`).then(row => {
                if(!row) {
                    message.channel.send({
                        embed: utils.embed(`Error!`, `There has been no warning issued with this ID`, [], {
                            color: "#ff0000"
                        })
                    });
                } else {
                    message.channel.send({
                        embed: utils.embed(`Warning ${row.warnID}`, stripIndents`
                        \`\`\`asciidoc
                        User :: ${client.users.get(row.warnedID).tag} (${row.warnedID})
                        Moderator :: ${client.users.get(row.modID).tag} (${row.modID})
                        Reason :: ${row.reason}
                        Appeal Status :: ${row.appeal}
                        \`\`\`
                        `)
                    });
                }
            });
        }
    }
};

module.exports.help = {
    command: 'warnings',
    usage: 'r.warn [to:user|from:mod] [userID|warnID]',
    category: 'Moderator',
    description: 'Check the warnings of the server'
};