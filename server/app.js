'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compress = require('compression');
const cors = require('cors');
const logger = require('morgan');
const _ = require('underscore');
var port = 8080;
const router = require('./router');

app.use(bodyParser.urlencoded({extend: true}));
app.use(bodyParser.json());
app.use(compress());
app.use(cors());
app.use(router);

if(process.env.NODE_ENV == 'production') {
	app.use(logger('tiny'));
	port = 3000;
}else{
	app.use(logger('dev'));
}

app.get('/', function (req, res) {
	if(process.env.NODE_ENV == 'production'){
		app.use(express.static('./dist/'));
		res.sendfile('./dist/index.html');
	}else{
		app.use(express.static('./app/'));
		res.sendfile('./app/index.html');
	}
});

app.get('/ping', function(req, res) {
	res.send('pong');
})

app.listen(port, function(){
	console.info("app listening on port: "+port);
});
