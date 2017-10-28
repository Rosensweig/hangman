import React from 'react';
import ReactDOM from 'react-dom';
import {configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import {shallow} from 'enzyme';
import Gallows from './Gallows';


test("shows the right image", () => {
	const wrapper = shallow(<Gallows guessesLeft={5} />);
	const img = wrapper.find("#hangmanImage").render();
	expect(img.attr("src")).toEqual("Hangman5.svg");
});