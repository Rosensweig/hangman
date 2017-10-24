import React from 'react';
import ReactDOM from 'react-dom';
import Gallows from './Gallows';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Gallows />, div);
});

test("shows the right image", () => {
	const div = document.createElement('div');
  ReactDOM.render(<Gallows guessesLeft={5} />, div);
	return document.getElementById("hangmanImage").getAttribute("src") == "Hangman5.svg";
})