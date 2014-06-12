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
                return indent() + transform(node);
            }).join(';\n') + ';\n';
        }
        return transform[node.type](node);
    }
    return node + '';
}

function indent(op) {
    switch (op) {
    case '+':
        ++indent.level;
        return indent();
    case '-':
        var keep = indent();
        --indent.level;
        return keep;
    case '{': case '(': case '[':
        ++indent.level;
        return op + '\n';
    case '}': case ')': case ']':
        --indent.level;
        return indent() + op;
    default:
        return (new Array(indent.level + 1)).join('  ');
    }
}
indent.level = 0;

transform['access'] = function (node) {
    var access = transform(node.expression);
    var field = transform(node.field);
    return [
        indent('('),
        indent(), '__choice_access__ = ', access, ',\n',
        indent(), '__choice_field__ = ', field, ',\n',
        indent(), '__choice_member__ = ',
        indent('('),
        indent(), '__choice_access__.__access__ ?\n',
        indent('+'), '__choice_access__.__access__(__choice_field__) :\n',
        indent('-'), '__choice_access__[__choice_field__]\n',
        indent(')'), ',\n',
        indent(), '(typeof __choice_member__ === "function") ?\n',
        indent('+'), '__choice_member__.bind(__choice_access__) :\n',
        indent('-'), '__choice_member__\n',
        indent(')')
    ].join('');
};

transform['call'] = function (node) {
    var callee = transform(node.callee);
    var arguments = node.arguments.map(transform).join(',');
    return [
        callee, '(', arguments, ')'
    ].join('');
};

transform['member'] = function (node) {
    return node.key + ': ' + transform(node.value);
};

transform['object'] = function (node) {
    return [
        indent('{'),
            node.members.map(function (member) {
                return indent() + transform(member);
            }).join(',\n'), '\n',
        indent('}')
    ].join('');
};

transform['array'] = function (node) {
    return [
        indent('['),
            node.contents.map(function (item) {
                return indent() + transform(item);
            }).join(',\n'), '\n',
        indent(']')
    ].join('');
};

transform['lambda'] = function (node) {
    var parameters = node.parameters.map(transform).join(', ');
    var result = transform(node.expression);
    return [
        '(', 'function (', parameters, ') ', indent('{'),
            indent(), 'return ', result, ';\n',
        indent('}'), ')'
    ].join('');
};

transform['var'] = function (node) {
    return [
        'var ', node.name, ' = ', transform(node.value)
    ].join('');
};

transform['val'] = function (node) {
    return [
        'const ', node.name, ' = ', transform(node.value)
    ].join('');
};

transform['if'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['else'] = function (node) {
    return [
        'else ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['if_else'] = function (node) {
    return [
        transform(node['if']), '\n',
        indent(), transform(node['else'])
    ].join('');
};

transform[','] = function (node) {
    var left = transform(node.left);
    var right = transform(node.right);
    return left + ', ' + right;
};

transform['typeof'] = function (node) {
    return [
        '(', 'typeof ', transform(node.expression), ')'
    ].join('');
};

transform['pre~'] = function (node) {
    return '~' + transform(node.expression);
};

transform['pre!'] = function (node) {
    return '!' + transform(node.expression);
};

transform['pre+'] = function (node) {
    return '+' + transform(node.expression);
};

transform['pre-'] = function (node) {
    return '-' + transform(node.expression);
};

transform['pre++'] = function (node) {
    return '++' + transform(node.expression);
};

transform['pre--'] = function (node) {
    return '--' + transform(node.expression);
};

transform['post++'] = function (node) {
    return transform(node.expression) + '++';
};

transform['post--'] = function (node) {
    return transform(node.expression) + '--';
};

transform['*'] = function (node) {
    return transform(node.left) + ' * ' + transform(node.right);
};

transform['/'] = function (node) {
    return transform(node.left) + ' / ' + transform(node.right);
};

transform['%'] = function (node) {
    return transform(node.left) + ' % ' + transform(node.right);
};
