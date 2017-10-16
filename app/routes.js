const requireText = require('require-text');
var dictionary = requireText('../extras/dictionary.txt', require);
dictionary = dictionary.split('\r\n');
const path = require('path');
const express  = require('express');


var games = {};


module.exports = function(app) {

	app.use(express.static(path.resolve(__dirname, '..', 'client/build')));

	app.get('/', (req, res) => {
	  res.sendFile(path.resolve(__dirname, '..', 'client/build', 'index.html'));
	});

	app.get('/newGame', function(req, res) {
		var word = dictionary[Math.floor(Math.random()*dictionary.length)];
		word = word.split('');
		var placeholders=[];
		for (var i=0; i<word.length; i++) {
			placeholders.push('_');
		}
		console.log("sessionID: ", req.sessionID);
		console.log("word: ", word);
		var timeout = setTimeout(clearGame, 1000*60*60, req.sessionID);
		var lettersGuessed = [];
		var guessesLeft = 10;
		games[req.sessionID] = {
			word,
			placeholders,
			lettersGuessed,
			guessesLeft,
			timeout
		};
		res.json({
			placeholders,
			lettersGuessed,
			guessesLeft
		});
	});

	app.get('/guess/:letter', function(req, res) {
		var game = games[req.sessionID];
		if (!game) {
			res.redirect('/newGame');
		}
		game.timeout = updateTimeout(game.timeout, req.sessionID);
		const letter = req.params.letter;
		console.log("letter is: ", letter);
		game.lettersGuessed.push(letter);
		var found = false;
		var finished = true;
		for (var i=0; i<game.word.length; i++) {
			if (game.word[i] === letter) {
				found = true;
				game.placeholders[i] = letter;
			} else if (game.placeholders[i] === "_") {
				finished = false;
			}
		}
		if (!found) {
			game.guessesLeft -= 1;
		}
		if (game.guessesLeft === 0) {
			game.placeholders = game.word;
		}
		res.json({
			placeholders: game.placeholders,
			lettersGuessed: game.lettersGuessed,
			guessesLeft: game.guessesLeft,
			finished: finished
		});

	});




}// ends module.exports

function clearGame(sessionID) {
	delete games[sessionID];
}

function updateTimeout(timeout, sessionID) {
	clearTimeout(timeout);
	var updatedTimeout = setTimeout(clearGame, 1000*60*60, sessionID);
	console.log("Timeout updated.");
	return updatedTimeout;
}