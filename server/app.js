var express = require('express');
var path = require('path');
var db = require('./database')
var DATABASE_URL = process.env.MONGO_URI;

var app = express()
app.set('port', process.env.PORT || 3000)
app.disable('x-powered-by')

//define static directory.
if(process.env.NODE_ENV == "production"){
	app.use(express.static(path.join(__dirname, './dist')));
}
else{
	app.use(express.static(path.join(__dirname, './public')))
}


app.get('/game', (req, res) => {
	db.constructGame()
		.then(game => {
			res.json(game);
		})
		.catch(err => {
			res.status(500).send({Error: err});
		});
});


//Index page.
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, './public/index.html'));
});

db.connect(DATABASE_URL, function(err){
	if(err){
		console.log("Err connecting to mongo: " + err);
		console.log("Aborting...");
		process.exit(1);
	}
	else {
		app.listen(app.get('port'), function(){
			console.log("Express listening on port " + app.get('port'));
		});
	}
});
//TODO: test db.connect() on listen.
