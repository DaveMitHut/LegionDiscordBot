// require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
    if (msg.content.startsWith('!card')) {
        var i = msg.content.indexOf(' ');
        var card = msg.content.split(" ");
        msg.reply(card[1]);
    }
})

client.on('message', msg => {
    if (msg.content == 'ping') {
        msg.reply('Pong!')
    }
})

client.on('guildMemberAdd', member => {
    member.send(`Welcome to our Server! Remember, DaveMitHut is the overlord here and as his creation, I swear everlasting loyalty to my creator!`)
})

client.login(process.env.LEGION_TOKEN)
