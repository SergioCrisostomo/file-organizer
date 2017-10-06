// import fs form 'fs';
// import exif from 'exif-parser';
// import readFolder from './readFolder';

const fs = require('fs');
const exif = require('exif-parser');
const readFolder = require('./lib/readFolder');
const findPossibleDuplicates = require('./lib/findPossibleDuplicates');

function extractMetaData(data) {
	let metadata, error;
	try {
		metaData = exif.create(data).parse();
	} catch (e) {
		error = e;
		metadata = null;
	}
	return {
		metaData,
		error
	};
}

function getFileStats(file) {
	return new Promise(function(resolve, reject) {
		fs.stat(file, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

function getFileContent(file) {
	return new Promise(function(resolve, reject) {
		fs.readFile(file, (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
}

function groupData(path, stats, buffer, metadata) {
	const string = buffer.toString('utf8');
	return {path, stats, /*string,*/ metadata};
}

module.exports = async (dir, {ext, recursive, verbose = true}) => {
	let files = await readFolder(dir, ext, recursive);
	console.log(`Found ${files.length} files...`);

	// files = files.slice(0, 900); // <-- usefull when debuging

	const stats = await Promise.all(files.map(getFileStats));
	if (verbose) console.log('Read files stats info...');

	const data = await Promise.all(files.map(getFileContent));
	if (verbose) console.log('Loaded all files...');

	const metaData = data.map((data, i) => {
		const {metadata, error} = extractMetaData(data);
		if (error) console.log('Error extracting metadata from ', files[i]);
		return metadata;
	});
	if (verbose) console.log('Extracted metadata...');

	const groupedData = files.map((file, i) => groupData(file, stats[i], data[i], metaData[i]));
	if (verbose) console.log('Grouped files...');

	const possibleDuplicates = findPossibleDuplicates(groupedData);
	if (verbose) console.log('Processed duplicates');

	return possibleDuplicates;
};
