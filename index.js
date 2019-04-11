require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const axios = require('axios')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

// display all commands
client.on('message', msg => {
    if (msg.content.startsWith('!commands'))  {
        msg.reply('!card cardname -> displays card to a given cardname\n' + 
                  '!legality cardname -> displays a cards legalities for Standard, Modern & Commander\n' + 
                  '!rulings cardname -> displays existing rulings for a card');
    }
})

// display card image with !card name
client.on('message', msg => {
    if (msg.content.startsWith('!card')) {
        var card = msg.content.split(" ");
        var req = 'https://api.scryfall.com/cards/named?fuzzy=';

        for (var i = 1; i < card.length; i++) {
            if (i == 1) {
                req += card[i];
            }
            else {
                req += '+' + card[i];
            }
        }
        axios.get(req)
            .then(function (response) {
                msg.reply(response.data.image_uris.normal);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

//display legalities with !legality name
client.on('message', msg => {
    if (msg.content.startsWith('!legality')) {
        var card = msg.content.split(" ");
        var req = 'https://api.scryfall.com/cards/named?fuzzy=';

        for (var i = 1; i < card.length; i++) {
            if (i == 1) {
                req += card[i];
            }
            else {
                req += '+' + card[i];
            }
        }
        axios.get(req)
            .then(function (response) {
                msg.reply('\nStandard: ' + response.data.legalities.standard + '\nModern: ' +
                          response.data.legalities.modern + '\nCommander: ' + 
                          response.data.legalities.commander);
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

// display card rulings with !rulings name
client.on('message', msg => {
    if (msg.content.startsWith('!rulings')) {
        var card = msg.content.split(" ");
        var req = 'https://api.scryfall.com/cards/named?fuzzy=';

        for (var i = 1; i < card.length; i++) {
            if (i == 1) {
                req += card[i];
            }
            else {
                req += '+' + card[i];
            }
        }
        axios.get(req)
            .then(function (response) {
                var id = response.data.id;
                var newreq = 'https://api.scryfall.com/cards/'
                newreq += id + '/rulings'
                axios.get(newreq)
                    .then(function (response) {
                        for (var i = 0; i < response.data.data.length; i++) {
                            msg.reply('\n' + 'From: ' + response.data.data[i].source + '\n' + response.data.data[i].comment)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

// greet new members
client.on('guildMemberAdd', member => {
    member.send(`Welcome to our Server! Remember, DaveMitHut is the overlord here and as his creation, I swear everlasting loyalty to my creator!`)
})

client.login(process.env.LEGION_TOKEN)
