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
      if (typeof(mainPath) == 'object') mainPath = mainPath[0]; // perhaps it's an array
      var mainJs = path.join('package', mainPath); 
      if (!/\.js$/.test(mainJs)) {
        mainJs += ".js"
      }
      var main = files[mainJs] || files['package/index.js'];
      if (!main) {
        return next(new Error("No main js file found"));
      }
      var expression = 
        "var require = function() { return function() {} };\n"+
        "var module = {}\n"+
        "var window = module;\n"+
        "var setTimeout = function() {}\n"+
        "var setInterval = function() {}\n"+
        "var process = {}\n"+
        main+"\n"+
        "[typeof(module.exports),  module.exports ? module.exports.toString() : false]\n";

      var results;
      try {
        results = eval(expression);
      } catch (e) {
        if (e.message == 'undefined is not a function') {
          return next(new Error("uses a required module"));
        }
        if (e.message == 'Unexpected identifier') {
          return next(new Error("code does not compile"));
        }
        if (/function \(\) \{\} has no method/.test(e.message)) {
          return next(new Error("uses a required module"));
        }
        return next(new Error('unclassified evaluation exception'));
      }
      try {
        if (!results || results[0] != 'function') return next(new Error("Does not export a function"));
        var code = esprima.parse("("+results[1]+")");
        var args = code.body[0].expression.params.map(function(param) { return param.name });
        latest.signature = packageName+"("+args.join(", ")+")";
        next(null, latest);
      } catch (e) {
        return next(e);
      }
    });
  });
};
