// this is used for Karma testing
const connect = require('connect');
const serveStatic = require('serve-static');
const PORT = 8080;
connect()
	.use(serveStatic(__dirname + '/ui'))
	.listen(PORT, function() {
		console.log('Server running on port ', PORT);
	});
