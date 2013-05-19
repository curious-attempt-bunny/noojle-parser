var npmPackageLatest = require('npm-package-latest');
var tgz              = require('tgz');
var request          = require('request');
var path             = require('path');
var esprima          = require('esprima');

module.exports = function(packageName, next) {
  npmPackageLatest(packageName, function(error, latest) {
    if (error) return next(error);
    tgz(request(latest.dist.tarball), function(error, files) {
      if (error) return next(error);
      var packageJson = JSON.parse(files['package/package.json']);
      var mainPath = packageJson.main || 'index.js'; 
      var mainJs = path.join('package', mainPath); 
      if (!/\.js$/.test(mainJs)) {
        mainJs += ".js"
      }
      var main = files[mainJs] || files['package/index.js'];
      var expression = 
        "require = function() { return function() {}; };\n"+
        main+"\n"+
        "[typeof(module.exports),  module.exports.toString()]\n";
      var results = eval(expression);
      if (results[0] != 'function') return next(new Error("Does not export a function"));
      var code = esprima.parse("("+results[1]+")");
      var args = code.body[0].expression.params.map(function(param) { return param.name });
      latest.signature = packageName+"("+args.join(", ")+")";
      next(null, latest);
    });
  });
};
