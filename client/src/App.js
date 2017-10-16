import React, { Component } from 'react';
import Game from './Game';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>Hangman</h1>
        </header>
        <Game />
      </div>
    );
  }
}

export default App;
