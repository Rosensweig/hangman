const requireText = require('require-text'); // Extends JS require() to import text files
var dictionary = requireText('../extras/dictionary.txt', require);
dictionary = dictionary.split('\r\n'); //make list of words into array
const path = require('path'); // simple file paths
const express  = require('express'); // express server


var games = {}; // stores current games, with sessionID as key


module.exports = function(app) {

	app.use(express.static(path.resolve(__dirname, '..', 'client/build'))); // allows browser to access static files, such as bundle.js

	app.get('/', (req, res) => {
	  res.sendFile(path.resolve(__dirname, '..', 'client/build', 'index.html')); // renders React app on browser call to home directory
	});


	// starts new game, and returns necessary JSON data for front-end use
	app.get('/newGame', function(req, res) {	
		var word = dictionary[Math.floor(Math.random()*dictionary.length)]; // choose a random word from dictionary
		word = word.split(''); // split word into array of characters for convenient handling 
		var placeholders=[];// placeholders contains a parallel array without spoilers, for client-side display.
		for (var i=0; i<word.length; i++) {
			placeholders.push('_');  // Individual spaces will be replaced with letters later, when they are correctly guessed
		}
		var timeout = setTimeout(clearGame, 1000*60*60, req.sessionID); // Clear game in an hour, to avoid holding millions of games in memory over time.
																																		// Stored in variable, so that we can reset the timer when they're actively playing
		var lettersGuessed = []; // List of letters the user has already guessed. Initialized as blank array.
		var guessesLeft = 10;	// User starts each game with 10 (incorrect) guesses before they lose.
		var won = 0;	// games user has won so far. Defaults to zero
		var lost = 0;	// games user has lost so far. Defaults to zero
		var finished = false; // has the user won yet? Starts false.
		if (games[req.sessionID]) { //do we have anything stored yet for the current session?
			won = games[req.sessionID].won;	// Update previous games won
			lost = games[req.sessionID].lost;	// Update previous games lost
		}
		games[req.sessionID] = {	//store the new game, with sessionID as key
			word,	// entire word, kept server-side only
			placeholders, // word placeholders, to be filled in as they are guessed
			lettersGuessed, //list of letters guessed so far, empty at this point
			guessesLeft, // number of user guesses remaining
			timeout, // stored timeout, server-side only, kept so that it can be reset each time user makes a request
			finished,	// has the user won yet? Starts false.
			won,	// games user has won so far
			lost	// games user has lost so far
		};
		res.json({	// send back partial game info as JSON, only the parts the client needs to know. (Variables explained above)
			placeholders,	
			lettersGuessed,
			guessesLeft,
			won,
			lost,
			finished
		});
	}); // ends newGame

	// handles each letter the user guesses, updates server records, and returns necessary JSON data for front-end use
	app.post('/guess/:letter', function(req, res) {
		var game = games[req.sessionID]; // retrieve the current game
		if (!game) {
			res.redirect('/newGame'); // if we didn't find a current game, start a new one
			return;
		}
		game.timeout = updateTimeout(game.timeout, req.sessionID); // clears old timeout, replaces with new one.
																															// allows user 1 hour before data is cleared
		const letter = req.params.letter;	// find user's current guess
		game.lettersGuessed.push(letter); // add letter to list of what user has already guessed
		var found = false;	// Have we found the letter anywhere in the array (yet)?
		var finished = true; // Has the user won?
		for (var i=0; i<game.word.length; i++) { //loop through letters in the word
			if (game.word[i] === letter) { // guessed letter is in the word, at the current position
				found = true;		// user made a correct guess
				game.placeholders[i] = letter;	// fill in the placeholders with the correct guess
			} else if (game.placeholders[i] === "_") {	// guessed letter is not at this position, and this position has not yet been filled.
				finished = false;	// user hasn't won yet. Keep guessing!
			}
		}
		if (!found) {	// guessed letter is not in the word
			game.guessesLeft -= 1;	// user loses a guess
		}
		if (game.guessesLeft === 0) {	// User has no guesses left. They've lost!
			game.lost +=1;	// Increment games lost
			game.placeholders = game.word;	// Show user the rest of the word, now that the game is over
		} else if (finished) { // User won!
			game.won +=1;	// Increment games won
			game.finished = true; //
		}
		res.json({ //send back partial game info as JSON, only the parts the client needs to know
			placeholders: game.placeholders,	// partial word, with guessed letters filled in
			lettersGuessed: game.lettersGuessed,	// list of letters guessed so far
			guessesLeft: game.guessesLeft,	// remaining user guesses (if zero, they've lost!)
			won: game.won,	// games user has won so far
			lost: game.lost,	// games user has lost so far
			finished: game.finished	// true if user has successfully guessed the whole word
		});
	}); // ends guess letter

	// finds existing game without modifying, to restore on page load/refresh
	app.get('/restore', function(req, res) {
		var game = games[req.sessionID];	// retrieve current game
		if (!game) {
			res.json({found:false});	// if we didn't find a current game, tell the front-end that.
			return;	// there isn't a game to load, so stop here
		}
		game.timeout = updateTimeout(game.timeout, req.sessionID); // clears old timeout, replaces with new one.
																															// allows user 1 hour before data is cleared
		res.json({	//send back game status as JSON, only the parts the client needs to know
			found: true, //tells frontend we found a game
			placeholders: game.placeholders,	// partial word, with guessed letters filled in
			lettersGuessed: game.lettersGuessed,	// list of letters guessed so far
			guessesLeft: game.guessesLeft,	// remaining user guesses (if zero, they've lost!)
			won: game.won,	// games user has won so far
			lost: game.lost,	// games user has lost so far
			finished: game.finished	// true if user has successfully guessed the whole word
		});
	}); // ends restore game 


}// ends module.exports



// clears a user's session, to avoid long-term storage of short-term data
function clearGame(sessionID) {
	delete games[sessionID]; // find the appropriate game, and delete it from our storage
}

// resets the timeout for a user's session to 60 minutes
function updateTimeout(timeout, sessionID) {
	clearTimeout(timeout); // clear previous timeout
	var updatedTimeout = setTimeout(clearGame, 1000*60*60, sessionID); // start new timeout, to clear after 1 hour of inactivity
	return updatedTimeout; //return the new timeout
}