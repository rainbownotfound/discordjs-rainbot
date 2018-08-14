const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
    response.sendStatus(200);
});
app.listen(process.env.PORT);

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const utils = require('./utils');
const client = new Discord.Client();
client.commands = new Discord.Collection();

fs.readdir('./src/commands/', (err, files) => {
    if(err) console.log(err);

    let jsFiles = files.filter(f => f.split(".").pop() === "js");

    if(jsFiles <= 0) {
        console.log(`No commands have been loaded.`);
        return;
    } else {
        console.log(`${jsFiles.length} commands have been loaded.`);
    }

    jsFiles.forEach((f, i) => {
        let cmds = require(`./src/commands/${f}`);
        client.commands.set(cmds.help.command, cmds);
    });
});

client.on("ready", () => {
    console.log(`I am ready to rumble!`);

    client.user.setPresence({ game: { name: "to RainbowNotFound's raps", type: 'LISTENING' } });
});

client.on('message', message => {
    if(message.author.bot) return;

    if(message.content.indexOf(config.prefix) !== 0) return;

    if(message.channel.type === "dm") {
        message.reply(`You can only use me on RainbowNotFound's server!`);
    } else {
        var cont = message.content.slice(config.prefix.length).split(" ");
        var args = cont.slice(1);
        var cmd = client.commands.get(cont[0]);
        if(cmd) {
            cmd.run(client, message, args);
        } else {
            message.channel.send({
                embed: utils.embed(`Error!`, `Command **${cont[0]}** not found!`, [], {
                    color: "#ff0000"
                })
            });
        }
    }
});

client.login(process.env.TOKEN);