exports.compile = function (ast) {
    return [
        'var __choice_access__, __choice_field__, __choice_member__;',
        transform(ast)
    ].join('\n');
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

transform['access'] = function (node) {
    return [
        '(\n',
        '__choice_access__ = ', transform(node.expression), ',\n',
        '__choice_field__ = ', transform(node.field), ',\n',
        '__choice_member__ = (',
        '__choice_access__.__access__ ?\n',
        '__choice_access__.__access__(__choice_field__) :\n',
        '__choice_access__[__choice_field__]\n',
        '),\n',
        '(typeof __choice_member__ === "function") ?\n',
        '__choice_member__.bind(__choice_access__) :\n',
        '__choice_member__',
        '\n)'
    ].join('');
};

transform['call'] = function (node) {
    return [
        '(', transform(node.callee), ')',
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
