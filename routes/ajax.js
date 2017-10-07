const organizer = require('../lib/index');

module.exports = (req, res) => {
	console.log(req.originalUrl, req.body);

	const {paths, ext, process} = req.body;
	const options = {verbose: true, process: process};
	if (process && ext.length > 0) options.ext = ext.map(type => '.' + type.toLowerCase()).join('|');

	organizer(req.body.paths, options)
		.then(data => res.send(data))
		.catch(e => console.log(e));
};
