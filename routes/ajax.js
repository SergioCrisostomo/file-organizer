const organizer = require('../lib/index');

module.exports = (req, res) => {
	console.log(req.originalUrl, req.body);

	const process = req.body.process;
	const options = {verbose: true, process: process};
	if (process) options.ext = '.jpg';

	organizer(req.body.paths, options)
		.then(data => res.send(data))
		.catch(e => console.log(e));
};
