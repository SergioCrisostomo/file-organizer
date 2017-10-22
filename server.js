'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const organizer = require('./routes/organizer');
const folderSelector = require('./routes/folderSelector');
const checkFolderExists = require('./routes/checkFolderExists');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/localhost'));

app.post('/organizer', organizer);
app.post('/folder-selector', folderSelector);
app.post('/check-path', checkFolderExists);

const fs = require('fs');
app.get('/iview.js', (req, res) => {
	const file = fs.readFileSync('../iview/dist/iview.js', 'utf8');
	res.send(file);
});

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
