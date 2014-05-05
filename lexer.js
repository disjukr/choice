var regex = new RegExp([
    '\\(|\\)|\\[|\\]|\\{|\\}', // parenthesis
    '(?:\\/\\/|#).*(?=\\r\\n|\\n|$)', // line comment
    '\\/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*+\\/', // multiline comment
    '\\/(?![\\s=])[^[\\/\\n\\\\]*(?:(?:\\\\[\\s\\S]|\\[[^\\]\\n\\\\]*(?:\\\\[\\s\\S][^\\]\\n\\\\]*)*])[^[\\/\\n\\\\]*)*\\/[gimy]{0,4}', // regex
    '0[0-9]+', // octal
    '0[Xx][0-9A-Fa-f]+', // hexadecimal
    '\\d*\\.?\\d+(?:[Ee](?:[+-]?\\d+)?)?', // decimal
    '"(?:[^\\\\"]|\\\\.)*"|\'(?:[^\\\\\']|\\\\.)*\'', // string
    ';', // semicolon
    '={2,3}|!=|!==|<|>|<=|>=', // comparison operator
    '=|(?:[~^!&|+\\-*/%]|<<|>>|>>>)=', // assignment operator
    '[+\\-]{2}|[~!]', // unary operator
    '[&|]{2}|[.,\\^&|+\\-*/%]|<<|>>|>>>', // binary operator
    '[?:]', // ternary operator
    '[$_A-Za-z][$_0-9A-Za-z]*', // identifier
    '[^\\s]+' // rest are illegal
].join('|'), 'g');

function tokenize(sourceCode) {
    var tokens = [];
    var token;
    do {
        token = regex.exec(sourceCode);
    }
    while (token && tokens.push(token[0]));
    regex.ladtIndex = 0;
    return tokens;
}

module.exports = tokenize;
