const rita = require('rita');
const fs = require('fs');

const string = 'It was a beautiful day. There was a smelly cat. It was very interesting.';
const markov = new rita.RiMarkov(3);

var data = '';

var readStream = fs.createReadStream('markov.txt', 'utf8');

readStream.on('data', function(chunk) {  
    data += chunk;
}).on('end', function() {
    markov.loadText(data);
    console.log(markov.generateSentences(2));
});