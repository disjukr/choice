var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
var result = parser.parse('if (true, false, 1) true;');
console.log(require('util').inspect(result, false, 10));
