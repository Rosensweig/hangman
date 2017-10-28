process.env.NODE_ENV = 'test';	// let the server know we're in the test environment

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

var firstGameResponse = {};

describe('GET /newGame', () => {
	it("should start a new Game", () => {
		chai.request(server)
		.get("/newGame")
		.end( (err, res) => {
			firstGameResponse = res;	// store response so we can check that restore gets the same game
			res.should.have.status(200);
			res.body.should.be.an("object");
			res.body.placeholders.should.be.an("array");
			res.body.placeholders.length.should.be.above(0);
			res.body.placeholders.should.include('_');
			res.body.lettersGuessed.should.be.an("array");
			res.body.lettersGuessed.length.should.equal(0);
			res.body.guessesLeft.should.equal(10);
			res.body.won.should.equal(0);
			res.body.lost.should.equal(0);
			res.body.finished.should.equal(false);
		});
	});
});

describe('GET /restore', () => {
	it("should return the same game as first test", () => {
		chai.request(server)
		.get("/restore")
		.end( (err, res) => {
			firstGameResponse.body.found=true;	// this is the only property that should be different from /newGame to /restore
			res.body.should.have.status(200);
			res.body.should.deep.equal(firstGameResponse);
		});
	});
});

describe('POST /letter/e', () => {
	it("should update word", () => {
		chai.request(server)
		.get("/letter/e")
		.end( (err, res) => {
			res.body.should.have.status(200);
			res.body.should.be.an("object");
			res.body.placeholders.should.be.an("array");
			res.body.placeholders.length.should.equal(firstGameResponse.body.placeholders.length);
			res.body.placeholders.should.include('_');
			res.body.lettersGuessed.should.be.an("array");
			res.body.lettersGuessed.should.include("e");
			res.body.lettersGuessed.length.should.equal(1);
			if (res.body.placeholders.indexOf("e") === -1) {
				res.body.guessesLeft.should.equal(9);
			} else {
				res.body.guessesLeft.should.equal(10);
			}
			res.body.alreadyGuessed.should.equal(false);
			res.body.won.should.equal(0);
			res.body.lost.should.equal(0);
			res.body.finished.should.equal(false);
		});
	});
});

