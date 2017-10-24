// Game.js is the main place where game logic is handled

// import React, and our other custom hangman components
import React, { Component } from 'react';
import Gallows from './Gallows';	// Displays different picture states of the gallows/hangman, depending on number of guesses left
																	// gallows pictures were created at draw.io
import Status from './Status';		// Displays game status for user

//create Game component
class Game extends Component {

	// Constructor functions allow us to set a default state and do other setup for our component.
	// They are also necessary for binding "this" to be the whole component.
	// Javascript's default handling of "this" does not serve our needs.
	constructor() {
		super();	// call React.component constructor before we add to it
		this.startGame = this.startGame.bind(this);	// Binds "this" so we can use it in the startGame function, referring to the whole component
		this.guess = this.guess.bind(this); // Same as above, for guess function
		this.state = {	// set initial state for component
				guessesLeft: -1,	// guessesLeft = -1 is our code for no active game. guessesLeft = 0 means they've lost.
				placeholders: [],	// empty array that will later hold the current word, blanks or letters according to what user has guessed so far
				lettersGuessed: [],	// list of the letters our user has guessed so far.
				alreadyGuessed: false,	// This controls a message telling the user if they've already guessed a letter.
																// Will be either single character (the repeated guess), or false. When false, displays nothing.
				finished: false,	// true if the user won the current game
				won: 0, // how many games have they won so far?
				lost: 0 // how many games have they lost so far?
			};
		window.addEventListener("keyup", this.guess, false);	// listen for keyup events, and run guess function on the event.
	}

	// Lifecycle method, called immediately before component loads. We'll use this to check for updated data, if we don't have a game yet.
	componentWillMount() {
		if (this.state.guessesLeft === -1) {	// -1 guesses left tells us we're in the default state, with no game loaded
			fetch('restore', { // call restore on our server, to restore existing game if it exists
			  credentials: 'include',	//include session info
			  method: 'GET',	// we want to get data
			  headers: {
			    Accept: 'application/json'	// we expect data to come back as JSON
			  },
			},
			).then( (response) => { // wait for server to return data, and capture response
			  if (response.ok) {	// Only go ahead if we have no errors
			    response.json()		// fetch has strange behavior requiring us to convert JSON data before we can use it below 
			    .then(json => {		// capture JSON data, now in usable form
			    	if (json.found) {
				      this.setState({	// update component's state. React will automatically render again with the new information
				      	placeholders: json.placeholders,	// partial word, to be filled in through server response
				      	lettersGuessed: json.lettersGuessed,	// list of letters guessed so far
				      	guessesLeft: json.guessesLeft,	// how many guesses remaining?
				      	alreadyGuessed: false,	// This controls a message telling the user if they've already guessed a letter.
																				// Will be either single character (the repeated guess), or false. When false, displays nothing.
				      	finished: json.finished,	// true if the user won the game
				      	won: json.won,	// how many games have they won so far?
				      	lost: json.lost	// how many games have they lost so far?
				      });
				    }
			    });
			  }
			});
		}
	} // ends componentDidMount


  // render method is how React adds components to the DOM, or displays them to the user.
  render() {

    var typeToGuess = "Type any letter to guess!";	// Instructions to user for how to play. Blank when there isn't an active game.
    var inputClasses = "mobile";	// mobile classes only display on mobile devices (defined in CSS)
  	if (this.state.guessesLeft<1 || this.state.finished) { // Is the user out of guesses, or have they already won?
  		typeToGuess = "";	// Don't offer option to continue guessing
  		inputClasses += " hidden";	// don't show text input even in mobile, when they aren't able to guess
  	}

  	// returns JSX (modified HTML according to Javascript templating) to render the component in HTML to the browser
  	// Note that commenting syntax is different inside JSX, and commenting is not allowed inside HTML elements.
  	// Look up to the constructor, instead, for descriptions of what individual parameters are.
    return (
      <div className="Game">
      	{/* button to start game. Says "Click to Start" the first time, but "Restart Game?" once there's already a game in progress or finished. */}
        <p><button onClick={() => this.startGame()}>{this.state.guessesLeft<0?"Click to Start":"Restart Game?"}</button>&nbsp;<input id="mobileInput" className={inputClasses} maxLength="1" size="4" /></p>
        <h2>{typeToGuess}</h2>{/* Tells user how to guess. Blank when they don't have the option. */}
        {/* Status component handles displaying most of the current game info */}
        <Status 
        	guessesLeft={this.state.guessesLeft}
        	placeholders={this.state.placeholders} 
        	lettersGuessed={this.state.lettersGuessed} 
        	alreadyGuessed={this.state.alreadyGuessed} 
        	finished={this.state.finished} 
        	won={this.state.won} 
        	lost={this.state.lost}
        />
        {/* Gallows displays hangman images */}
        {/* guessesLeft tells Gallows which image to display */}
        <Gallows 
        	guessesLeft={this.state.guessesLeft} 
        />
      </div>
    );

  } //ends render function

  // starts a new game
  startGame() {
  	if (this.state.guessesLeft > 0 && !(this.state.finished) ) { // User is still in the middle of a game
  		if ( !(window.confirm("Are you sure you want to start over?")) ) { //confirm they want to start a new one anyway
  			return; //if not, exit startGame() so they can continue playing the existing game
  		}
  	}
  	fetch('newGame', { //call newGame on our server
		  credentials: 'include',	//include session info
		  method: 'GET',	// we want to get data
		  headers: {
		    Accept: 'application/json'	// we expect data to come back as JSON
		  },
		},
		).then( (response) => { // wait for server to return data, and capture response
		  if (response.ok) {	// Only go ahead if we have no errors
		    response.json()		// fetch has strange behavior requiring us to convert JSON data before we can use it below 
		    .then(json => {		// capture JSON data, now in usable form
		      this.setState({	// update component's state. React will automatically render again with the new information
		      	placeholders: json.placeholders,	// partial word, to be filled in through server response
		      	lettersGuessed: json.lettersGuessed,	// list of letters guessed so far
		      	guessesLeft: json.guessesLeft,	// how many guesses remaining?
		      	finished: false	// it's a brand new game, so we know they haven't won yet
		      });
		    });
		  }
		});
	} // ends startGame function

	// User hit a key. It's probably a guess for our game
	guess(event) {
		document.getElementById('mobileInput').value=""; //for mobile users, clear the text input field
		if (event.keyCode === 13) {	//user hit the enter key.
			this.startGame(); //restart game. If we're in the middle of a game, startGame() will ask for confirmation, so we don't have to handle that here.
			return; //don't continue the function after calling startGame()
		}
		if (64<event.keyCode && event.keyCode<91) { // User hit a letter key
			if ( this.state.finished || (this.state.guessesLeft === 0) ) {	// did they already win or lose this game?
				if (window.confirm("Start a new game?")) {	// ask if they want to start a new game
					this.startGame();	// user said yes, so start the next game
				}
				return; // whether they want a new game or not, don't handle the guess any further
			}
			var letter = String.fromCharCode(event.keyCode).toLowerCase(); //which letter did they guess? Store it.
			if ( !(this.state.lettersGuessed.indexOf(letter)===-1) ) {	//check whether they already guessed this letter
				this.setState({	//Set the new state. React will render the component again with the new information
					alreadyGuessed:letter 	// State needs to know that it was a repeat guess, and which letter was repeated.
				});
				return; // Don't do any more handling for a repeat guess
			}
			fetch('/guess/'+letter, {	// call server with user's guess (which we know is a letter, and not a repeat)
				credentials: 'include',	// include session info
				method: 'GET',	// we want to get data
				headers: {
					Accept: 'application/json'	// we expect data to come back as JSON
				}
			}).then( (response) => { // wait for server to return data, and capture response
				if (response.ok) {	// only go ahead if we have no errors
					response.json()	// fetch has strange behavior requiring us to convert JSON data before we can use it below
					.then( json => { // capture JSON data, now in usable form
						this.setState({ // update component's state. React will automatically render again with the new information
			      	placeholders: json.placeholders, // partial word, to be filled in through server response
			      	lettersGuessed: json.lettersGuessed, // list of letters guessed so far
			      	guessesLeft: json.guessesLeft, // how many guesses remaining?
			      	alreadyGuessed: false, // guess is not a repeat. We checked above, so we wouldn't have gotten this far.
			      	finished: json.finished, // did they win the game?
			      	won: json.won,	// how many games have they won?
			      	lost: json.lost	// how many games have they lost?
			      });
					});
				}
			});
		}
	} //ends guess function


} //ends Game component


export default Game; // allows other components to access and use Game