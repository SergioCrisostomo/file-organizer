
# File organizer

---

**TL;DR:** A node.js script to organize files, handle duplicates and filter files

**The real story:** Along the years my photos have been stored in places I thought were smart. With the years, after changing computers, changing hard drives, started and not finished organizing and cleaning stuff... then kids came into life and now everything was a mess.

So I started this project to fix this mess. If you have been there and want to use this, re-write this text it or make the program better: your're welcome!

# How to Use

This repository is in development. If you want to try it, run `sandbox.js` to get a idea.

### API

The organizer takes 2 arguments:

 - `folder`: the folder to start looking for images
 - `options`: the options to use (optional).
    - `ext`: file extension
    - `verbose`: to show verbose logs (_defaults to `true`_)
    - `recursive`: if it should look for files in subdirectories (_defaults to `false`_)

### Example

const organizer = require('./index');
organizer(folder, {ext: '.jpg', verbose: true, recursive: true})
	.then(res => console.log('RESULT:', res))
	.catch(e => console.log(e));


---

## Roadmap:

 - add actions to the results found so user can actually fix/organize files
 - add tests (Jest)
 - add a UI with a localhost (probably Vue.js)
