import React, { Component } from 'react';

class Status extends Component {
  render() {

    var guesses = "";
    // var word = "";
    var color = "";
    // for (var i=0; i<this.props.placeholders.length; i++) {
    //   word += (this.props.placeholders[i] + " ");
    // }
    
    if (this.props.guessesLeft === -1 ) {
      return (
        <div className="Status"></div>
      );
    } else if (this.props.guessesLeft === 0 ) {
      guesses = "You lost!";
      color = "red";
    } else if (this.props.finished) {
      guesses = "You won!";
      color = "green";
    } else {
      guesses = "You have " + this.props.guessesLeft + " guesses left!";
    }

    var repeated = "";
    if (this.props.alreadyGuessed) {
      repeated = "You already guessed '" + this.props.alreadyGuessed + "'!";
    }


    return (
      <div className="Status">
        <h2 className={color}>{guesses}</h2>
        <h3>Guessed so far: {this.props.lettersGuessed}</h3>
        <h3>{repeated}</h3>
        {this.wordLink(this.props.finished||(this.props.guessesLeft === 0), this.props.placeholders)}
      </div>
    );
  }

  wordLink(finished, placeholders) {
    var word = "";
    var link = "https://www.thefreedictionary.com/";
    for (var i=0; i<placeholders.length; i++) {
      word += (placeholders[i] + " ");
      link += placeholders[i];
    }

     if (finished) {
      return (
        <h2>
          <a href={link} target="_blank">
            {word}
          </a>
        </h2>
      );
    } else {
      return (
        <h2>
          {word}
        </h2>
      );
    }

  }

}

export default Status;
