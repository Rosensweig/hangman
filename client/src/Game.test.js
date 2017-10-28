import React from 'react';
import ReactDOM from 'react-dom';
import {configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import {shallow, mount} from 'enzyme';
import Game from './Game';

global.fetch = require('jest-fetch-mock');
fetch.mockResponse(JSON.stringify({
	placeholders: ['a', 'd', 'a', 'g', '_'],
	lettersGuessed: ['a', 'i', 'd', 'g', 'x'],	
	guessesLeft: 28,	
	won: 7,	
	lost: 5,	
	finished: false
}));



test("Saves server response in state", (done) => {
	const wrapper = mount(<Game />);
	wrapper.instance().startGame();
	setTimeout(() => {
		expect(wrapper.state("won")).toBe(7);
		expect(wrapper.state("lost")).toBe(5);
		expect(wrapper.state("guessesLeft")).toBe(28);
		expect(wrapper.state("lettersGuessed")).toEqual(['a', 'i', 'd', 'g', 'x']);
		expect(wrapper.state("placeholders")).toEqual(['a', 'd', 'a', 'g', '_']);
		done();
}, 100);
	
});