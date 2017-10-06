// import fs from 'fs';
// import path from 'path';

const fs = require('fs');
const path = require('path');

function getFiles(dir, fileType, rec, files_) {
	const regex = fileType ? new RegExp('\\' + fileType + '$') : '';
	return fs.readdirSync(dir).reduce((allFiles, file) => {
		const name = path.join(dir, file);
		if (rec && fs.statSync(name).isDirectory()) {
			getFiles(name, fileType, rec, allFiles);
		} else if (file.match(regex)) {
			allFiles.push(name);
		}
		return allFiles;
	}, files_ || []);
}

module.exports = (path, type, recursive = true) => {
	return new Promise((resolve, reject) => {
		resolve(getFiles(path, type, recursive));
	});
};
