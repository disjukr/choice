exports.compile = compile;
function compile(ast) {
    var fragments = [
        transform(ast)
    ];
    if (compile.choice_access)
        fragments.unshift('var __choice_access__, __choice_field__, __choice_member__;');
    compile.choice_access = false;
    return fragments.join('\n');
};
compile.choice_access = false;

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
        return indent(++indent.level);
    case '-':
        return indent(indent.level--);
    case '>':
        return indent(indent.level + 1);
    case '<':
        return indent(indent.level - 1);
    case '{': case '(': case '[':
        ++indent.level;
        return op + '\n';
    case '}': case ')': case ']':
        --indent.level;
        return indent() + op;
    case undefined:
        return indent(indent.level);
    default:
        return (new Array(Math.max(0, (op | 0) + 1))).join(indent.unit);
    }
}
indent.unit = '  ';
indent.level = 0;

function unary(type) {
    transform[type] = function (node) {
        return [
            '(', type, ' ', transform(node.expression), ')'
        ].join('');
    };
}

function prefix(type) {
    transform['pre' + type] = function (node) {
        return [
            '(', type, ' ', transform(node.expression), ')'
        ].join('');
    };
}

function postfix(type) {
    transform['post' + type] = function (node) {
        return [
            '(', transform(node.expression), ' ', type, ')'
        ].join('');
    };
}

function infix(type) {
    transform[type] = function (node) {
        return [
            '(',
                transform(node.left),
                ' ', type, ' ',
                transform(node.right),
            ')'
        ].join('');
    };
}

['typeof'].forEach(unary);
['~', '!', '+', '-', '++', '--'].forEach(prefix);
['++', '--'].forEach(postfix);
[
    ',',
    '*', '/', '%',
    '+', '-',
    '<<', '>>', '>>>',
    '<', '>', '<=', '>=',
    'instanceof', 'in',
    '==', '!=', '===', '!==',
    '&', '^', '|',
    '&&', '||',
    "=",
    "*=", "/=", "%=",
    "+=", "-=",
    "<<=", ">>=", ">>>=",
    "&=", "^=", "|="
].forEach(infix);

transform['choice_access'] = function (node) {
    compile.choice_access = true;
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

transform['access'] = function (node) {
    var access = transform(node.expression);
    var field = transform(node.field);
    return [
        '(', access, '[', field, ']', ')'
    ].join('');
};

transform['dot_access'] = function (node) {
    var access = transform(node.expression);
    var field = transform(node.field);
    return [
        '(', access, '.', field, ')'
    ].join('');
};

transform['call'] = function (node) {
    var callee = transform(node.callee);
    var arguments = node.arguments.map(transform).join(',');
    return [
        '(', callee, '(', arguments, ')', ')'
    ].join('');
};

transform['new'] = function (node) {
    var expression = transform(node.expression);
    var arguments = node.arguments.map(transform).join(',');
    return [
        '(', 'new ', expression, '(', arguments, ')', ')'
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
    return [
        '(', 'function (', parameters, ') ', indent('{'),
            indent(), 'return ', transform(node.expression), ';\n',
        indent('}'), ')'
    ].join('');
};

transform['block_lambda'] = function (node) {
    var parameters = node.parameters.map(transform).join(', ');
    return [
        '(', 'function (', parameters, ') ', indent('{'),
            transform(node.statements),
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

transform['return'] = function (node) {
    return 'return';
};

transform['return_value'] = function (node) {
    return 'return ' + transform(node.value);
};

transform['conditional_return'] = function (node) {
    return [
        'if (', transform(node.condition), ') ',
            indent('>'), 'return;'
    ].join('');
};

transform['conditional_return_value'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', indent('{'),
            indent(), 'return ' + transform(node.value), ';\n',
        indent('}')
    ].join('');
};

transform['func'] = function (node) {
    var name = node.name;
    var parameters = node.parameters.map(transform).join(', ');
    return [
        'function ', name, '(', parameters, ') ', indent('{'),
            indent(), 'return ', transform(node.expression), ';\n',
        indent('}')
    ].join('');
};

transform['block_func'] = function (node) {
    var name = node.name;
    var parameters = node.parameters.map(transform).join(', ');
    return [
        'function ', name, '(', parameters, ') ', indent('{'),
            transform(node.statements),
        indent('}')
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

transform['break'] = function (node) {
    return 'break';
};

transform['break_label'] = function (node) {
    return 'break ' + node.label;
};

transform['conditional_break'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', '\n',
        indent('>'), 'break'
    ].join('');
};

transform['conditional_break_label'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', '\n',
        indent('>'), 'break ', node.label
    ].join('');
};

transform['continue'] = function (node) {
    return 'continue';
};

transform['continue_label'] = function (node) {
    return 'continue ' + node.label;
};

transform['conditional_continue'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', '\n',
        indent('>'), 'continue'
    ].join('');
};

transform['conditional_continue_label'] = function (node) {
    return [
        'if (', transform(node.condition), ') ', '\n',
        indent('>'), 'continue ', node.label
    ].join('');
};

transform['loop'] = function (node) {
    return [
        'while (true) ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['labeled_loop'] = function (node) {
    return [
        node.label + ': while (true) ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['while'] = function (node) {
    return [
        'while (', node.condition, ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['labeled_while'] = function (node) {
    return [
        node.label + ': while (', node.condition, ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['for'] = function (node) {
    return [
        'for (', node.init, '; ', node.condition, '; ', node.loop, ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['labeled_for'] = function (node) {
    return [
        node.label + ': for (',
            transform(node.init), '; ',
            transform(node.cond), '; ',
            transform(node.loop),
        ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['for_in'] = function (node) {
    return [
        'for (var ', node.key, ' in ', transform(node.object), ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['labeled_for_in'] = function (node) {
    return [
        node.label + ': for (var ', node.key, ' in ', transform(node.object), ') ', indent('{'),
            transform(node.statements),
        indent('}')
    ].join('');
};

transform['ternary'] = function (node) {
    return [
        '(',
            transform(node.condition), ' ? ',
            transform(node['true']), ' : ',
            transform(node['false']),
        ')'
    ].join('');
};

transform['argument'] = function (node) {
    return [
        '(arguments[', (node.index | 0) - 1, '])'
    ].join('');
};
