var regex = new RegExp(
    [
        '\\(|\\)|\\[|\\]|\\{|\\}', // parenthesis
        '(?:\\/\\/|#).*(?:\\r\\n|\\n|$)', // line comment
        '\\/(?![\\s=])[^[\\/\\n\\\\]*(?:(?:\\\\[\\s\\S]|\\[[^\\]\\n\\\\]*(?:\\\\[\\s\\S][^\\]\\n\\\\]*)*])[^[\\/\\n\\\\]*)*\\/[gimy]{0,4}', // regex
        '0[0-9]+', // octal
        '0[Xx][0-9A-Fa-f]+', // hexadecimal
        '\\d*\\.?\\d+(?:[Ee](?:[+-]?\\d+)?)?', // decimal
        '"(?:[^\\\\"]|\\\\.)*"|\'(?:[^\\\\\']|\\\\.)*\'', // string
        ';', // semicolon
        '[.,?:~^!&|+\\-*/%=]', // operator
        '[&|]{2}', // and, or operator
        '[$_A-Za-z][$_0-9A-Za-z]*', // identifier
        '[^\\s]+' // rest are illegal
    ].join('|'), 'g'
);
// todo: multiline comment

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
