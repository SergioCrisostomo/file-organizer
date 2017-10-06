// import organizer from './index';

const organizer = require('./index');
const tests = './__tests__/images';

// configure the folder where to look for images
const folders = [tests];

organizer(folders, {ext: '.jpg', verbose: true, recursive: true})
	.then(res => console.log('RESULT:', JSON.stringify(res, null, '  ')))
	.catch(e => console.log(e));
