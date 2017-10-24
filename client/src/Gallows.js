// Gallows.js shows different hangman image depending on current game state

// import React
import React, { Component } from 'react';

//create Gallows component
class Gallows extends Component {

  // render method is how React adds components to the DOM, or displays them to the user.
  render() {
    var hangman = "Hangman10.svg"; // default image file name, shows empty gallows
    if (this.props.guessesLeft>-1) {  // We've started a game. guessesLeft = -1 indicates no game on our server for this session
      hangman = "Hangman" + this.props.guessesLeft + ".svg";  // image file name. Which image should we show?
    }

    // returns JSX (modified HTML according to Javascript templating) to render the component in HTML to the browser
    // Note that commenting syntax is different inside JSX
    return (
      <div className="Gallows">
        <img id="hangmanImage" src={hangman} className="hangman" alt="Hangman"/> {/* Set image src according to guessesLeft and file name */}
      </div>
    );
  }
}

export default Gallows; // allows other components to access and use Gallows
