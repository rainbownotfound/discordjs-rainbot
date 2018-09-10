const utils = require('../utils');

module.exports.run = async (client, message, args) => {
    let commandz = client.commands.map(c => `[${c.help.command}](${c.help.description})`).join('\n');
    const action = args[0];

    if(!action) {
        message.channel.send({
            embed: utils.embed(`All Commands`, `Total Commands: ${client.commands.size}\n\`\`\`markdown\n${commandz}\n\`\`\``, [
                {
                    name: 'Extra Help',
                    value: 'Try \`r.help <commandName>\` for more info on a command!\n*Do not include the <>*'
                }
            ])
        });
    } else if (action === "all") {
        message.channel.send({
            embed: utils.embed(`All Commands`, `Total Commands: ${client.commands.size}\n\n${commandz}`, [
                {
                    name: 'Extra Help',
                    value: 'Try \`r.help <commandName>\` for more info on a command!\n*Do not include the <>*'
                }
            ])
        });
    } else {
        const commandsFinder = client.commands.get(args[0]);

        if(!commandsFinder) {
            message.channel.send({
                embed: utils.embed(`Error!`, `I could not find command **${args[0]}**`, [
                    {
                        name: 'Possible Solutions',
                        value: `Please try \`r.help all\` for a list of all commands!`
                    },
                    {
                        name: 'Nothing helped?',
                        value: `You can always try to join the [Support Server](https://discord.gg/sDjAxt4)!`
                    }
                ], {
                    color: "#ff0000"
                })
            });

            client.channels.get('466390830072987658').send({
                embed: utils.embed(`Error Noticed!`, `${message.author.tag} just recieved the following error:\n\n\`\`\`markdown\n[Guild](${message.guild.name})\n[Guild ID](${message.guild.id})\n[User](${message.author.tag})\n\n[Error ID](HELP-001)\n\`\`\`\nThe user has recieved an error in command "db?help".\n\nReason: They searched for a non-existing command!`)
            });
        } else {
            message.channel.send({
                embed: utils.embed(`Command - ${args[0]}`,``, [
                    {
                        name: 'Name',
                        value: commandsFinder.help.command
                    },
                    {
                        name: 'Usage',
                        value: commandsFinder.help.usage
                    },
                    {
                        name: 'Category',
                        value: commandsFinder.help.category,
                        inline: false
                    },
                    {
                        name: 'Description',
                        value: commandsFinder.help.description,
                        inline: false
                    }
                ], {
                    inline: true
                })
            });
        };
    }
};

module.exports.help = {
    command: 'help',
    usage: 'r.help <all|commandName>',
    category: 'Info',
    description: 'All the info you need for a nice little command!'
};