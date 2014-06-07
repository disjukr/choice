exports.compile = function (ast) {
    return transform(ast);
};

function transform(node) {
    if (typeof node === 'object') {
        if (node instanceof Array) {
            return node.map(function (node) {
                return transform(node);
            }).join(';');
        }
        return transform[node.type](node);
    }
    return node + '';
}

transform['call'] = function (node) {
    return [
        transform(node.callee),
        '(',
        node.arguments.map(transform).join(','),
        ')'
    ].join('');
};

transform['member'] = function (node) {
    return node.key + ':' + transform(node.value);
};

transform['object'] = function (node) {
    return '{' + node.members.map(transform).join(',') + '}';
};

transform['lambda'] = function (node) {
    return [
        'function (', node.parameters.map(transform).join(','), ')',
        '{',
        'return ', transform(node.expression),
        '}'
    ].join('');
};

transform['val'] = function (node) {
    return [
        'const ',
        node.name,
        ' = ',
        transform(node.value),
        ';'
    ].join('');
};

transform['if'] = function (node) {
    return [
        'if (', transform(node.condition), ')',
        '{',
        transform(node.statements),
        '}'
    ].join('');
};
