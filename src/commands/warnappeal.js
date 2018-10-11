const sql = require('sqlite');
const stripIndents = require('common-tags').stripIndents;
const utils = require('../../utils');
const config = require('../../config.json');
sql.open('./warnings.sqlite');

const randomTip = () => {
    return utils.randomSelection([
        `You will be DMed when an appeal is created for a warning you\'ve given!`,
        `If you feel like the warning is given by accident, contact RainbowNotFound and he\'ll look into it!`,
        `Don\'t encourage the user to request an appeal! They need to decide this themselves!`
    ]);
};

module.exports.run = (client, message, args) => {
    if(message.channel.type !== 'dm') {
        message.channel.send({
            embed: utils.embed(`Error!`, `This command can only be used in Direct Messages!`, [], {
                color: "#ff0000"
            })
        });
    } else {
        const action = args[0];

        if(!action) {
            message.channel.send({
                embed: utils.embed(`Usage`, stripIndents`
                This command uses a certain API for warn appeals.

                __**Argument Bracket Info:**__
                \`<>\` means the argument is required
                \`[]\` means the argument is optional
                ***Do not use these brackets in the arguments!***

                __**Command usages:**__
                \`r.warnappeal request <warnID> <reason>\`
                \`r.warnappeal accept <warnID>\`
                \`r.warnappeal deny <warnID>\`
                `)
            });
        } else if (action === "request") {
            const warningID = args[1];

            if(!warningID) {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You must specify a warn ID!`, [], {
                        color: "#ff0000"
                    })
                });
            } else {
                sql.get(`SELECT * FROM warnings WHERE warnID = "${warningID}"`).then(row => {
                    if(!row) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warn ID does not exist! Please try a valid warn ID!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.warnedID !== message.author.id) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `You are not the one who recieved this warning! Please do not request appeals for the warnings of somebody else.`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.appeal === "Appeal Pending") {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning already has an active appeal pending! Please wait until a response has been given.`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.appeal === "Appeal Denied") {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning has a denied appeal! You can\'t request another appeal!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else {
                        const appealReason = args.slice(2).join(" ");

                        if(!appealReason) {
                            message.channel.send({
                                embed: utils.embed(`Error!`, `You must specify a reason!`, [], {
                                    color: "#ff0000"
                                })
                            });
                        } else {
                            sql.run(`UPDATE warnings SET appeal="Appeal Pending", appealReason="${appealReason}" WHERE warnID="${warningID}"`);

                            setTimeout(function() {
                                client.channels.get('487377071677636618').send({
                                    embed: utils.embed(`WarnSystem`, stripIndents`
                                    ${message.author.tag} has requested an appeal!
    
                                    Warning Details:
                                    \`\`\`asciidoc
                                    User :: ${row.warnedID}
                                    Warned By :: ${row.modID}
    
                                    Warn ID :: ${row.warnID}
    
                                    Appeal Status :: Appeal Pending
                                    Appeal Reason :: ${appealReason}
                                    \`\`\`
                                    The moderator has been DMed with the same message.
                                    `)
                                });
    
                                client.fetchUser(row.modID).then(user => {
                                    user.send({
                                        embed: utils.embed(`WarnSystem`, stripIndents`
                                        ${client.users.get(row.warnedID).tag} has requested an appeal!
    
                                        Warning Details:
                                        \`\`\`asciidoc
                                        User :: ${client.users.get(row.warnedID).tag}
                                        Warned By :: ${client.users.get(row.modID).tag}
    
                                        Warn ID :: ${row.warnID}
    
                                        Appeal Status :: Appeal Pending
                                        Appeal Reason :: ${appealReason}
                                        \`\`\`
                                        Please be careful while choosing your reply, you are not able to change it later, and ${client.users.get(row.warnedID).username} will not be able to request another appeal.
                                        
                                        Please use the following command syntax to accept/deny appeals:
                                        \`r.warnappeal accept <warnID>\`
                                        \`r.warnappeal deny <warnID>\`
                                        `)
                                    });
                                });
                            }, 5000);
                        }
                    }
                })
            }
        } else if (action === "accept") {
            const warningID = args[1];

            if(!warningID) {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You must specify a warning using it\'s ID!`, [], {
                        color: "#ff0000"
                    })
                });
            } else {
                sql.get(`SELECT * FROM warnings WHERE warnID = "${warningID}"`).then(row => {
                    if (!row) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning cannot be found!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if(row.appeal === "No Appeal Created") {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `There is no appeal pending on this warning! Please wait until the warned user has requested an appeal.\n\n**TIP!** ${randomTip()}`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.appeal === "Appeal Denied") {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning already has an appeal denied! This cannot be changed.`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.modID !== message.author.id && message.author.id !== config.developers.rainbow) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `You are not the Moderator who issued this warning!\n\nPlease contact **${client.users.get(row.modID).tag}** to respond to this appeal!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else {
                        message.channel.send({
                            embed: utils.embed(`WarnSystem`, `You have successfully accepted this appeal! The warning has been deleted!`)
                        });

                        client.fetchUser(row.warnedID).then(user => {
                            user.send({
                                embed: utils.embed(`WarnSystem`, stripIndents`
                                Your warning appeal with ID ${warningID} has been accepted! The warning will be deleted within 10 minutes!

                                Details:
                                \`\`\`asciidoc
                                User :: ${client.users.get(row.warnedID).tag}
                                Moderator :: ${client.users.get(row.modID).tag}
                                Warn ID :: ${warningID}

                                Reason :: ${row.reason}

                                Appeal Status :: Appeal Accepted, Warning Will Be Deleted In 10 Minutes!
                                Appeal Reason :: ${row.appealReason}
                                \`\`\`
                                `)
                            });
                        });

                        client.channels.get('487377071677636618').send({
                            embed: utils.embed(`WarnSystem`, stripIndents`
                            The requested appeal for warning ${warningID} has been accepted!

                            Warning Details:
                            \`\`\`asciidoc
                            User :: ${row.warnedID}
                            Warned By :: ${row.modID}

                            Warn ID :: ${row.warnID}

                            Appeal Status :: Appeal Accepted
                            Appeal Reason :: ${row.appealReason}
                            \`\`\`
                            The warning will be deleted within 10 minutes!
                            `)
                        });

                        setTimeout(function() {
                            sql.run(`DELETE FROM warnings WHERE warnID = "${warningID}"`);
                        }, 60000);
                    }
                });
            }
        } else if (action === "deny") {
            const warningID = args[1];

            if(!warningID) {
                message.channel.send({
                    embed: utils.embed(`Error!`, `You must specify a warning using it\'s ID!`, [], {
                        color: "#ff0000"
                    })
                });
            } else {
                sql.get(`SELECT * FROM warnings WHERE warnID = "${warningID}"`).then(row => {
                    if(!row) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning cannot be found!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.modID !== message.author.id && message.author.id !== config.developers.rainbow) {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `You are not the Moderator who issued this warning!\n\nPlease contact **${client.users.get(row.modID).tag}** to respond to this appeal!`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else if (row.appeal === "No Appeal Created") {
                        message.channel.send({
                            embed: utils.embed(`Error!`, `This warning does not have a pending appeal request!\n\n**TIP!** ${randomTip()}`, [], {
                                color: "#ff0000"
                            })
                        });
                    } else {
                        message.channel.send({
                            embed: utils.embed(`WarnSystem`, stripIndents`
                            You have denied the following appeal request:
                            \`\`\`asciidoc
                            User :: ${client.users.get(row.warnedID).tag}
                            Moderator :: ${client.users.get(row.modID).tag}
                            Warn ID :: ${row.warnID}

                            Reason :: ${row.reason}

                            Appeal Status :: Appeal Denied
                            Appeal Reason :: ${row.appealReason}
                            \`\`\`
                            `)
                        });

                        client.fetchUser(row.warnedID).then(user => {
                            user.send({
                                embed: utils.embed(`WarnSystem`, stripIndents`
                                Your appeal on warning ${warningID} has been denied!

                                Details:
                                \`\`\`asciidoc
                                User :: ${client.users.get(row.warnedID).tag}
                                Moderator :: ${client.users.get(row.modID).tag}
                                Warn ID :: ${row.warnID}

                                Reason :: ${row.reason}

                                Appeal Status :: Appeal Denied
                                Appeal Reason :: ${row.appealReason}
                                \`\`\`
                                `)
                            });
                        });

                        client.channels.get('487377071677636618').send({
                            embed: utils.embed(`WarnSystem`, stripIndents`
                            The requested appeal for warning ${warningID} has been denied!

                            Warning Details:
                            \`\`\`asciidoc
                            User :: ${row.warnedID}
                            Warned By :: ${row.modID}

                            Warn ID :: ${row.warnID}

                            Appeal Status :: Appeal Denied
                            Appeal Reason :: ${row.appealReason}
                            \`\`\`
                            The warning will remain saved until the next ban wipe.
                            `)
                        });

                        setTimeout(function() {
                            sql.run(`UPDATE warnings SET appeal = "Appeal Denied", appealReason = "Appeal Denied"`);
                        }, 1000);
                    }
                });
            }
        }
    }
};

module.exports.help = {
    command: 'warnappeal',
    usage: 'r.warnappeal',
    category: 'Moderator',
    description: 'User are able to request appeals with this command!'
};