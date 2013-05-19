# Description [![build status](https://secure.travis-ci.org/curious-attempt-bunny/noojle-parser.png)](http://next.travis-ci.org/curious-attempt-bunny/noojle-parser)

Parses an npm package for its key API information

# Usage

    var parser = require('noojle-parser');
    parser(packageName, function(error, packageData) { console.log(packageData.signature); );

# Installation

    npm install noojle-parser

# License

MIT
