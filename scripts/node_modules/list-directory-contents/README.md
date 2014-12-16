# list-directory-contents

Implements `ls -R` for Node.js.

## Installation

```sh
$ npm install list-directory-contents
```

## Usage

```javascript
var ls = require('list-directory-contents');

ls('./', function (err, tree) {
  
  // NOTE:
  // everything ending in `/` in the output below is a path to a directory
  // all other paths are to files
  
  
  // `tree` =>
  [
    'index.js',
    'README',
    'package.json',
    'CONTRIBUTING.md',
    'node_modules/',

    'node_modules/lodash/',
    'node_modules/async/',
    'node_modules/fs-extra/',

    'node_modules/fs-extra/index.js',
    'node_modules/fs-extra/lib/',
    'node_modules/fs-extra/node_modules/'
  ];
  
});
```

## Why?

This module is merely a convenience; a thin wrapper for [walker](https://github.com/daaku/nodejs-walker).  It presents a minimalist API for the most basic task you're likely to get up to: getting all the things in a directory, all the things in those things, and so forth.  @daaku did all the hard work :)

For more advanced use cases like built-in file vs. dir parsing, fetching `lstat` metadata, or controlling the universe mind bullets, please use [walker](https://github.com/daaku/nodejs-walker) directly.  See https://github.com/jprichardson/node-fs-extra/issues/63#issuecomment-49733873 for ergaleígony.


## License

MIT &copy; Mike McNeil 2014
