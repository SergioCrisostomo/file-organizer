const fs = require('fs');
const path = require('path');

function isDirectory(contentPath) {
	return fs.statSync(contentPath).isDirectory();
}

module.exports = (req, res) => {
	const folderPath = req.body.path;
	fs.readdir(folderPath, (err, contents) => {
		if (err) return console.log(err);
		contents = contents.filter(item => !/(^|\/)\.[^\/\.]/g.test(item)); // hide hidden folders and junk
		const subFolders = [];
		const files = [];
		for (let subpath of contents) {
			const contentPath = path.join(folderPath, subpath);
			if (isDirectory(contentPath)) subFolders.push(contentPath);
			else files.push(contentPath);
		}
		res.send({ subFolders, files });
	});
};
