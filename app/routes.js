

module.exports = function(app) {
	
	app.get('/newGame', function(req, res) {
		console.log(req.session);
		console.log(req.sessionID);
		res.json({"data":"Placeholder"});
	});




}// ends module.exports