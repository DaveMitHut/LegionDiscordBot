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
        var i;
        var req = 'https://api.scryfall.com/cards/names?fuzzy=';
        var cardlength = card.length;

        for (i = 1; i < cardlength; i++) {
            if (i == 1) {
                req += card[i];
            }
            else {
                req += '+' + card[i];
            }
        }
        const Http = new XMLHttpRequest();
        const url = req;
        Http.open("GET", url);
        Http.send();

        Http.onreadystateexchange=function() {
           if (this.readystate==4 && this.status==200) {
               console.log(Http.responseText)
           }
        }
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
