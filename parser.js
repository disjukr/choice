var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
var result = parser.parse('val a = 1;');
console.log(require('util').inspect(result, false, 10));
