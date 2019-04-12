const Discord = require('discord.js')
const client = new Discord.Client()
const axios = require('axios')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

/* on wrong command, show how to view all commands
client.on('message', msg => {
    if (!msg.content.startsWith('!commands') && !msg.content.startsWith('!card') && !msg.content.startsWith('!cards') &&
        !msg.content.startsWith('!legality') && !msg.content.startsWith('!legalities') && !msg.content.startsWith('!legal') &&
        !msg.content.startsWith('!rulings') && !msg.content.startsWith('!ruling')) {
        msg.reply(', it looks like you have a typo in your command.\nType !commands to see what I can do for you.');
    }
}) */

// display all commands
client.on('message', msg => {
    if (msg.content.startsWith('!commands')) {
        msg.reply(', here is a list of what I can do:\n!card cardname -> displays card for a given cardname\n' + 
                  '!legality cardname -> displays a cards legalities for Standard, Modern & Commander\n' + 
                  '!rulings cardname -> displays existing rulings for a card');
    }
})

// roll a specified number of specified dice
client.on('message', msg => {
    if (msg.content.startsWith('!dice') || msg.content.startsWith('!roll')) {
        var cont = msg.content.split(" ");
        var dice = cont[1].split("d");
        for (var i = 0; i < dice[0]; i++) {
            var rand = (Math.random * dice[1]) + 1;
            msg.reply('\nRoll ' + i + ': ' + rand);
        }
    }
})

// display card image with !card name
client.on('message', msg => {
    if (msg.content.startsWith('!card') || msg.content.startsWith('!cards')) {
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
                if (response.data.image_uris.normal == undefined) {
                    msg.reply(', I am sorry, but I could not find any cards with that name.');
                }
                else {
                    msg.reply(response.data.image_uris.normal);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

//display legalities with !legality name
client.on('message', msg => {
    if (msg.content.startsWith('!legality') || msg.content.startsWith('!legalities') || msg.content.startsWith('!legal')) {
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
                if (response.data.legalities.standard == undefined) {
                    msg.reply(', I am sorry, but I could not find any cards with that name.');
                }
                else {
                    msg.reply('\nStandard: ' + response.data.legalities.standard + '\nModern: ' +
                              response.data.legalities.modern + '\nCommander: ' + 
                              response.data.legalities.commander);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

// display card rulings with !rulings name
client.on('message', msg => {
    if (msg.content.startsWith('!rulings') || msg.content.startsWith('!ruling')) {
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
                if (response.data == undefined) {
                    msg.reply(', I am sorry, but I could not find any cards with that name.');
                }
                else {
                    var id = response.data.id;
                    var newreq = 'https://api.scryfall.com/cards/'
                    newreq += id + '/rulings'
                    axios.get(newreq)
                        .then(function (response) {
                            if (response.data.data == undefined) {
                                msg.reply(', there seem to be no rulings for the given card.');
                            }
                            else {
                                for (var i = 0; i < response.data.data.length; i++) {
                                    msg.reply('\n' + 'From: ' + response.data.data[i].source + '\n' + response.data.data[i].comment)
                                }
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
})

// greet new members
client.on('guildMemberAdd', member => {
    member.send(`Welcome to our Server! Remember, DaveMitHut is the overlord here and as his creation, 
                 I swear everlasting loyalty to my creator! If you want to see what I am capable of, 
                 type !commands in the main chatroom.`)
})

client.login(process.env.LEGION_TOKEN)
