import React, { Component } from 'react';

class Gallows extends Component {
  render() {
    var hangman = "Hangman10.svg";
    if (this.props.guessesLeft>-1) {
      hangman = "Hangman" + this.props.guessesLeft + ".svg";
    }
    return (
      <div className="Gallows">
        <img src={hangman} className="hangman" alt="Hangman"/>
      </div>
    );
  }
}

export default Gallows;
