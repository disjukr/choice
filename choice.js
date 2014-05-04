var tokenize = require('./lexer.js');

function parse(tokens) {
    return [{type: 'if', condition: true, statements: []}];
}

function compile(ast) {
    return 'if (true) {}'
}

function translate(sourceCode) {
    var tokens = tokenize(sourceCode);
    var ast = parse(tokens);
    var code = compile(ast);
    return code;
}

module.exports.translate = translate;
