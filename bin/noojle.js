#!/usr/bin/env node

var parser = require('..');

if (process.argv.length != 3) {
  console.error('Usage:');
  console.error('noojle <package name>');
  return;
}

parser(process.argv[2], function (error, api) {
  if (error) return console.error(error.message);

  console.log(api.signature);
});
