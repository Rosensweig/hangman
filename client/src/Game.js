import React, { Component } from 'react';
import Gallows from './Gallows';
import Status from './Status';

class Game extends Component {
	constructor() {
		super();
		this.startGame = this.startGame.bind(this);
		this.guess = this.guess.bind(this);
		this.state = {
			guessesLeft: -1,
			placeholders: [],
			lettersGuessed: [],
			alreadyGuessed: false,
			finished: false
		}
		window.addEventListener("keyup", this.guess, false);
	}



  render() {
  	

    var typeToGuess = "Type any letter to guess!";
    var inputClasses = "mobile";
  	if (this.state.guessesLeft<1 || this.state.finished) {
  		typeToGuess = "";
  		inputClasses += " hidden";
  	}


    return (
      <div className="Game">
        <p><button onClick={() => this.startGame()}>{this.state.guessesLeft<0?"Click to Start":"Restart Game?"}</button>&nbsp;<input id="mobileInput" className={inputClasses} maxLength="1" size="4" /></p>
        <h2>{typeToGuess}</h2>
        <Status 
        	guessesLeft={this.state.guessesLeft} 
        	placeholders={this.state.placeholders}
        	lettersGuessed={this.state.lettersGuessed}
        	alreadyGuessed={this.state.alreadyGuessed}
        	finished={this.state.finished}
        />
        <Gallows guessesLeft={this.state.guessesLeft} />
      </div>
    );
  }

  startGame() {
  	if (this.state.guessesLeft > 0 && !(this.state.finished) ) {
  		if ( !(window.confirm("Are you sure you want to start over?")) ) {
  			return;
  		}
  	}
  	fetch('newGame', {
		  credentials: 'include',
		  method: 'GET',
		  headers: {
		    Accept: 'application/json'
		  },
		},
		).then( (response) => {
		  if (response.ok) {
		    response.json().then(json => {
		      this.setState({
		      	placeholders: json.placeholders,
		      	lettersGuessed: json.lettersGuessed,
		      	guessesLeft: json.guessesLeft,
		      	finished: false
		      });
		    });
		  }
		});
	}

	guess(event) {
		document.getElementById('mobileInput').value="";
		if (event.keyCode === 13) {
			this.startGame();
			return;
		}
		if (64<event.keyCode && event.keyCode<91) {
			if ( this.state.finished || (this.state.guessesLeft === 0) ) {
				if (window.confirm("Start a new game?")) {
					this.startGame();
				}
				return;
			}
			var letter = String.fromCharCode(event.keyCode).toLowerCase();
			if ( !(this.state.lettersGuessed.indexOf(letter)===-1) ) {
				this.setState({
					alreadyGuessed:letter
				});
				return;
			}
			fetch('/guess/'+letter, {
				credentials: 'include',
				method: 'GET',
				headers: {
					Accept: 'application/json'
				}
			}).then( (response) => {
				if (response.ok) {
					response.json().then( json => {
						this.setState({
			      	placeholders: json.placeholders,
			      	lettersGuessed: json.lettersGuessed,
			      	guessesLeft: json.guessesLeft,
			      	alreadyGuessed: false,
			      	finished: json.finished
			      });
					});
				}
			});
		}
	}


}

export default Game;