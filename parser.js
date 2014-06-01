var Parser = require("jison").Parser;
var parser = new Parser(require('./choice.json'));
var result = parser.parse('test; 123; 0xabc;');
console.log(result);
