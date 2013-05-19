var parser = require('..');
var test   = require('tape');

test('obtain package API', function(t) {
  parser('npm-package-latest', function(error, api) {
    t.equal(api.name, 'npm-package-latest');
    t.ok(api.signature, 'Expect API signature');
    t.end();
  });
});
