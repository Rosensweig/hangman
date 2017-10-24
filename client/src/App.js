// App.js is a simple container class for our game. It contains no functional game logic.

// import React, and our other custom hangman components
import React, { Component } from 'react';
import Game from './Game'; // contains primary game functionality

//create App component
class App extends Component {

  // render method is how React adds components to the DOM, or displays them to the user.
  // this component includes only the site title, and all other functionality is inside the Game component
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

export default App; // allows other components to access and use App
