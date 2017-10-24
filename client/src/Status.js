// Status.js handles displaying user data

// import React, and our other custom hangman components
import React, { Component } from 'react';

// create Status component
class Status extends Component {

  // render method is how React adds components to the DOM, or displays them to the user.
  render() {

    var guesses = ""; //Will tell user how many guesses they have left, unless game is alredy won or lost.
                      // If they already won or lost, tell them that instead
    var color = "";   // Classname for color. Red if they lost, green if they won, or empty otherwise
    
    if (this.props.guessesLeft === -1 ) { // User has not yet started a game. Return an empty component.
      return (
        <div className="Status"></div>
      );
    } else if (this.props.guessesLeft === 0 ) { // User ran out of guesses
      guesses = "You lost!";  // Tell them they lost, in place of usual number of guesses
      color = "red";  // Display in red, because they lost
    } else if (this.props.finished) { // User successfully guessed the whole word
      guesses = "You won!"; // tell them they won
      color = "green";  // Display in green, because they won
    } else {  // Game still in progress, with positive number of guesses left
      guesses = "You have " + this.props.guessesLeft + " guesses left!";  // tell user how many guesses they have left
    }

    var repeated = "";  // Tell the user when they're repeating a guess. Empty for non-display the rest of the time
    if (this.props.alreadyGuessed) {  // User is making a repeat guess
      repeated = "You already guessed '" + this.props.alreadyGuessed + "'!";  // Tell them they already guessed that letter
    }

    // returns JSX (modified HTML according to Javascript templating) to render the component in HTML to the browser
    // Note that commenting syntax is different inside JSX
    return (
      <div className="Status">
        <h2 className={color}>{guesses}</h2> {/* Tells user how many guesses they left, or if they won/lost. Red if lost, green if won. */}
        <h3>You've won {this.props.won} games, and lost {this.props.lost} games.</h3> {/* Tell how many games they won/lost */}
        <h3>Guessed so far: {this.props.lettersGuessed}</h3> {/* Tells user which letters they've already guessed */}
        <h3>{repeated}</h3> {/* If user is making a repeat guess, tell them that, and which letter */}
        {this.wordLink(this.props.finished||(this.props.guessesLeft === 0), this.props.placeholders)} {/* Check whether game is over, pass to wordLink for display and possible linkage (see comments on function below) */}
      </div>
    );
  }

  // Helper function. Converts placeholders array into string with spaces, for display.
  // Additionally, if the game is over, makes the finished word a link to The Free Dictionary.
  // Users will surely get some words they don't know, so make it easy to look them up!
  // Note: unfortunately, our word list is bigger than their dictionary, so sometimes the word won't be found.
  wordLink(finished, placeholders) {
    var word = "";  // word as it will be displayed to the user
    var link = "https://www.thefreedictionary.com/"; // Link to the free dictionary. 
    for (var i=0; i<placeholders.length; i++) { //loop through the letters of our (possibly incomplete) word
      word += (placeholders[i] + " ");  // Fill in our word with spaces for display
      link += placeholders[i];  // Fill in our word without spaces, for dictionary link
    }

     if (finished) {  // if we're finished, we'll need the dictionary link
      return (
        <h2>
          <a href={link} target="_blank"> {/* Link to look up word in dictionary, in new tab */}
            {word}  {/* Show the word */}
          </a>
        </h2>
      );
    } else {  // game isn't done yet, so we don't need the dictionary link
      return (
        <h2>
          {word}  {/* Show the word */}
        </h2>
      );
    }

  }

}

export default Status;  // allows other components to access and use Status
