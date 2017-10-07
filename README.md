
# File organizer

**TL;DR:** A node.js script to organize files, handle duplicates and filter files

**The real story:** For many years i stored my photos in places I thought were smart, different places because I kept getting different ideas. After some years, changing computers, changing hard drives, after starting and not finishing organizing and cleaning stuff... my files are spread in many different folders and hard drives... Then kids came into life, more photos came along, and now everything was a mess.

So I started this project to fix this mess.  
If you _have been there_ and want to use this, re-write this text it or make the program better: your're welcome!

# How to Use

> This repository is in development. If you want to try it, run `node sandbox` to get an idea.

### API

The organizer takes 2 arguments:

 - `folders`: a folder array to start looking for images
 - `options`: the options to use (optional).
    - `ext`: file extension
    - `verbose`: to show verbose logs (_defaults to `true`_)
    - `recursive`: if it should look for files in subdirectories (_defaults to `false`_)
    - `process`: if it should find duplicates or just show a file list (_defaults to `true`_)

### Example

    const organizer = require('./index');
    organizer(folder, {ext: '.jpg', verbose: true, recursive: true})
    	.then(res => console.log('RESULT:', res))
    	.catch(e => console.log(e));



## Roadmap:

 - add actions to the results found so user can actually fix/organize files
 - add tests (Jest)
 - add a UI with a localhost (Vue.js + iView UI)
