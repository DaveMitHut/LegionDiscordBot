const Discord = require('discord.js')
const client = new Discord.Client()
const axios = require('axios')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

//on wrong command, show how to view all commands
client.on('message', msg => {
    if (msg.content.startsWith('!')) {
        if (!(msg.content.startsWith('!commands')) && !(msg.content.startsWith('!card')) && !(msg.content.startsWith('!cards')) &&
            !(msg.content.startsWith('!legality')) && !(msg.content.startsWith('!legalities')) && !(msg.content.startsWith('!legal')) &&
            !(msg.content.startsWith('!rulings')) && !(msg.content.startsWith('!ruling')) && !(msg.content.startsWith('!dice')) &&
            !(msg.content.startsWith('!roll'))) {
                msg.reply('it looks like you have a typo in your command.\nType !commands to see what I can do for you.');
        }
    }
})

// display all commands
client.on('message', msg => {
    if (msg.content.startsWith('!commands')) {
        msg.reply('here is a list of what I can do:\n!card cardname -> displays card for a given cardname\n\n' + 
                  '!legality cardname -> displays a cards legalities for Standard, Modern & Commander\n\n' + 
                  '!rulings cardname -> displays existing rulings for a card\n\n' + 
                  '!dice xdx -> rolls the specified number of dice for you. !roll works as well');
    }
})

// display Cassandra text
client.on('message', msg => {
    if (msg.content.startsWith('!cassandra')) {
        msg.reply('In der Session vom 15.04.2020 wurde Cassandra, Davids erster Spielercharakter in dieser Kampagne, durch eine herabfallende Decke erschlagen (weil Simon sein Feature vergessen hat).');
    }
})

// roll a specified number of specified dice with !dice xdx
client.on('message', msg => {
    if (msg.content.startsWith('!dice') || msg.content.startsWith('!roll')) {
        var cont = msg.content.split(" ");
        var dice = cont[1].split("d");
        var sides = parseInt(dice[1], 10);
        for (var i = 0; i < dice[0]; i++) {
            var rand = Math.floor(Math.random() * sides) + 1;
            msg.reply('\nRoll ' + (i+1) + ': ' + rand);
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
                    msg.reply('I am sorry, but I could not find any cards with that name.');
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
                    msg.reply('I am sorry, but I could not find any cards with that name.');
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
                    msg.reply('I am sorry, but I could not find any cards with that name.');
                }
                else {
                    var id = response.data.id;
                    var newreq = 'https://api.scryfall.com/cards/'
                    newreq += id + '/rulings'
                    axios.get(newreq)
                        .then(function (response) {
                            if (response.data.data == undefined) {
                                msg.reply('there seem to be no rulings for the given card.');
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

// greet new members and give them the role "imp"
client.on('guildMemberAdd', member => {
    member.send(`Willkommen auf unserem Server! Um zu sehen, wozu diese Entität fähig ist,
                 schreibe "!commands" in einen der Chaträume.`)
    member.send(`Welcome to our Server! If you want to see what this entity is capable of, 
                 type "!commands" in the main chatroom.`)
    //add user to role "imp" and catch errors
    let role = message.guild.roles.find(r => r.name === "imp");
    member.addRole(role).catch(console.error);
})

client.login(process.env.LEGION_TOKEN)
