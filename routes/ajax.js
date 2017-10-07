const organizer = require('../lib/index');

module.exports = (req, res) => {
	console.log(req.originalUrl, req.body);

	organizer(req.body.paths, {ext: '.jpg', verbose: true, recursive: false})
		.then(data => res.send(data))
		.catch(e => console.log(e));
};
