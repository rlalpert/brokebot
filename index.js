const fs = require('fs');
const Discord = require('discord.js');
const secret = require('./secret');

const markov = require('markov');
const m = markov(1);
const bot = new Discord.Client();

const markovListener = fs.createWriteStream('./data/markov.txt', {flags: 'a'});
const s = fs.createReadStream('./data/markov.txt');

bot.on('ready', () => {
  console.log('BrokeBot GO!');
});

m.seed(s, () => {
  bot.on('message', (msg) => {
    if (msg.mentions.users.find(val => val.id === secret.botId)) {
      let res = m.respond(msg.toString()).join(' ');
      msg.channel.sendMessage(res);
    }
  });
});

bot.on('message', (msg) => {
  if (!msg.author.bot && (msg.content[0] !== '!') && (!msg.mentions.users.find(val => val.id === secret.botId))) {
    markovListener.write(`${msg.content}\n`);
  }
});

bot.on('error', e => console.error(e));

bot.login(secret.botToken);