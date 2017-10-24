// index.js is the file that React loads by default, and where we'll load our main app

// import React, CSS styling, and our App that contains the other content
import React from 'react'; 
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root')); // load App into the root element of our (otherwise empty) HTML
