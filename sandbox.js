// import organizer from './index';

const organizer = require('./index');
const tests = './__tests__/images';

// configure the folder where to look for images
const folder = tests;

organizer(folder, {ext: '.jpg', verbose: true, recursive: true})
	.then(res => console.log('RESULT:', res))
	.catch(e => console.log(e));
