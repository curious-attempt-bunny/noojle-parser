# Description [![build status](https://secure.travis-ci.org/curious-attempt-bunny/noojle-parser.png)](http://next.travis-ci.org/curious-attempt-bunny/noojle-parser)

Parses an npm package for its key API information

# API Installation

    npm install noojle-parser

# API Usage

    var parser = require('noojle-parser');
    parser(packageName, function(error, packageData) { console.log(packageData.signature); );

# Tool Installation

    npm install -g noojle-parser

# Tool Usage

    noojle <package name>

# License

MIT
