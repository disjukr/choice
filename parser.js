var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
var result = parser.parse('for (1; 2; 3) statement;');
console.log(require('util').inspect(result, false, 10));
