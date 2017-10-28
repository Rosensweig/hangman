import React from 'react';
import ReactDOM from 'react-dom';
import {configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import {shallow} from 'enzyme';
import Status from './Status';

const wrapper = shallow(<Status 
  	guessesLeft={17}
  	placeholders={['d','r','a','m','a']} 
  	lettersGuessed={['d','r','n','s','t','x','m']} 
  	alreadyGuessed={'e'} 
  	finished={true} 
  	won={3} 
  	lost={2}
  />);

it("Changes color when you win", () => {
  const guesses = wrapper.find("#guesses").render();
	expect(guesses.attr("class")).toEqual("green");
});

it("Links to Free Dictionary on finished game", () => {
	const placeholders = wrapper.find('#placeholders a').render();
	expect(placeholders.attr("href")).toBe("https://www.thefreedictionary.com/drama");
});

it("displays games won and lost", () => {
	const wonLost = wrapper.find("#wonLost").render();
	expect(wonLost.text()).toEqual(expect.stringContaining("won 3"));
	expect(wonLost.text()).toEqual(expect.stringContaining("lost 2"));
});