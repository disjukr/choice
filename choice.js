var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
var compiler = require('./compiler.js');

module.exports.compile = function (source) {
    var ast = parser.parse(source);
    return compiler.compile(ast);
};
