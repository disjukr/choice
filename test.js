var Parser = require('jison').Parser;
var parser = new Parser(require('./choice.json'));
require('fs').writeFileSync(__dirname + '/temp.js', parser.generate());

console.log('===== SOURCE =====');
var source = 'for label (var i = 0; i < 10; ++i) { statement; }';
console.log(source);

console.log('===== AST =====');
var ast = parser.parse(source);
console.log(require('util').inspect(ast, false, 10));

console.log('===== RESULT =====');
var js = require('./compiler.js').compile(ast);
console.log(js);
