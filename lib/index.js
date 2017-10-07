// import fs form 'fs';
// import exif from 'exif-parser';
// import readFolder from './readFolder';

const fs = require('fs');
const exif = require('exif-parser');
const readFolder = require('./readFolder');
const findPossibleDuplicates = require('./findPossibleDuplicates');

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

async function processFolder(files, root, {verbose}) {
	console.log(`Found ${files.length} files in ${root} folder...`);
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

	return {
		files,
		possibleDuplicates
	};
}

module.exports = async (dirs, {ext, recursive, verbose = true}) => {
	const folders = await Promise.all(dirs.map(dir => readFolder(dir, ext, recursive)));
	const data = await Promise.all(folders.map((files, i) => processFolder(files, dirs[i], {verbose})));
	return data.reduce((obj, folderData, i) => {
		console.log(dirs[i]);
		obj[dirs[i]] = folderData;
		return obj;
	}, {});
};
