'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const ajax = require('./routes/ajax');
const checkFolderExists = require('./routes/checkFolderExists');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/localhost'));

app.post('/ajax', ajax);
app.post('/check-path', checkFolderExists);

app.use(function(err, req, res, next) {
	const status = err.status || 500;
	res.status(status);
	res.send(err);
});

const server = app.listen(process.env.PORT || 8080, function() {
	const host = server.address().address;
	const port = server.address().port;
	console.log('App listening at http://%s:%s', host, port);
});
