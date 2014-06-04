var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
require('fs').writeFileSync(__dirname + '/temp.js', parser.generate());
var result = parser.parse('val a = [1, 2, 3][field1].field2;');
console.log(require('util').inspect(result, false, 10));
