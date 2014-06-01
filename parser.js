var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
var result = parser.parse('for ( var i = 0; 1; 2);');
console.log(require('util').inspect(result, false, 10));
