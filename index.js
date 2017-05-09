const fs = require('fs');
const Discord = require('discord.js');
const secret = require('./secret');
const rita = require('rita');

const bot = new Discord.Client();

const markov = new rita.RiMarkov(3);
var data = '';

const markovListener = fs.createWriteStream('markov.txt', {flags: 'a'});
var readStream = fs.createReadStream('markov.txt', 'utf8');

readStream.on('data', function(chunk) {  
    data += chunk;
}).on('end', function() {
    markov.loadText(data);
});

bot.on('ready', () => {
  console.log('BrokeBot GO!');
});

bot.on('message', (msg) => {
  if (msg.mentions.users.find(val => val.id === secret.botId) && !msg.author.bot) {
    let rs = new rita.RiString(msg.content);
    let words = rs.words();
    console.log(words);
    // let words = rs.words();
    // console.log(words);
    // let pos = words.pos();
    // let tokens = '';
    // for (let i = 0; i < words.length; i++) {
    //   if (pos[i] === 'nn')
    //     // msg.channel.sendMessage('aloha');
    //     tokens += i;
    // }
    // console.log(tokens);
    if (words.length >0) {
    //   for (let i = 0; i < (tokens.length); i++) {
        msg.channel.sendMessage(markov.loadTokens(words).generateSentences(1));
      //   console.log(tokens[i]);
      // }
      // msg.channel.sendMessage('Where is your god now?');
    }
    else
      msg.channel.sendMessage(markov.generateSentences(1));
  }
});

bot.on('message', (msg) => {
  if (!msg.author.bot && (msg.content[0] !== '!') && (!msg.mentions.users.find(val => val.id === secret.botId))) {
    markovListener.write(`${msg.content}\n`);
  }
});

bot.on('error', e => console.error(e));

bot.login(secret.botToken);