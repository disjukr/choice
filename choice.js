// before translation
class Parent {
    new (whoami) {
        console.log(whoami);
    }
    a(b) {
        return b;
    }
    /abc/ = 'abc';
}

class Child extends Parent {
    new () {
        super('Child');
    }
    a(b) {
        return super.a(b);
    }
    x = 1;
    y = 2;
    /xyz/() {
        return field;
    }
}

var child = new Child;
var object = {a: 'b'};
var array = [1, 2, 3];
console.log(child.xyz, object.a, array[0]);

var condition = true;
if (condition) {
    for (var item in object) {
        console.log(item);
    }
    for a (var i = 0; i < 20; ++i) {
        console.log(i);
        while b (condition) {
            loop c {
                if (i > 10)
                    break b if condition;
                else {
                    ++i;
                    continue c while condition;
                }
            }
        }
    }
}

try e {
    throw child if true;
}
catch if e instanceof Parent {
    console.log('parent');
}
catch if e instanceof Child {
    console.log('child');
}
catch {
    console.log(e);
}
finally {
    console.log('fin');
}

try e {
    throw 'err';
}
catch if false {
    console.log('pass');
}
finally {
    console.log('miss');
}


// after translation
function Parent() {
    var __this__ = this;
    var __index__ = [
        'a',
        /abc/
    ];
    var __value__ = [
        function (b) {
            var field = ['a'];
            return b;
        },
        'abc'
    ];
    __this__.__access__ = function (__field__) {
        __field__ = __field__.toString();
        for (var i = 0; i < __index__.length; ++i) {
            var index = __index__[i];
            if (__field__ === index) {
                return __value__[i];
            }
            if (index instanceof RegExp) {
                var field = index.exec(__field__);
                if (field && (field.length > 0)) {
                    var value = __value__[i];
                    if (typeof value === 'function') {
                        return value.bind(__this__, field);
                    }
                    return value;
                }
            }
        }
        if (typeof __super__ !== 'undefined') {
            return __super__.__access__(__field__);
        }
        return undefined;
    }
    __this__.__init__ = function (whoami) {
        (console.__access__ ? console.__access__('log') : console['log']).call(console, whoami);
    }
}

function Child() {
    var __this__ = this;
    var __super__ = __this__.prototype = new Parent();
    var __index__ = [
        'a',
        'x',
        'y',
        /xyz/
    ];
    var __value__ = [
        function (b) {
            var field = ['a'];
            return __super__.__access__('a')(b);
        },
        1,
        2,
        function (field) {
            var __callee__ = arguments.callee;
            Array.prototype.shift.call(arguments);
            arguments.callee = __callee__;
            return field;
        }
    ];
    __this__.__access__ = function (__field__) {
        for (var i = 0; i < __index__.length; ++i) {
            var index = __index__[i];
            if (__field__ === index) {
                return __value__[i];
            }
            if (index instanceof RegExp) {
                var field = index.exec(__field__);
                if (field && (field.length > 0)) {
                    var value = __value__[i];
                    if (typeof value === 'function') {
                        return value.bind(__this__, field);
                    }
                    return value;
                }
            }
        }
        if (typeof __super__ !== 'undefined') {
            return __super__.__access__(__field__);
        }
        return undefined;
    }
    __this__.__init__ = function () {
        __super__.__init__('Child');
        return __this__;
    }
}
Child.prototype = new Parent();

var child = (new Child()).__init__();
var object = {a: 'b'};
var array = [1, 2, 3];
(console.__access__ ? console.__access__('log') : console['log']).call(
    console,
    (child.__access__ ? child.__access__('xyz') : child['xyz']),
    (object.__access__ ? object.__access__('a') : object['a']),
    (array.__access__ ? array.__access__('0') : array['0'])
);

var condition = true;
if (condition) {
    for (var item in object) {
        console.log(item);
    }
    a: for (var i = 0; i < 20; ++i) {
        console.log(i);
        b: while (condition) {
            c: while (true) {
                if (i > 10) {
                    if (condition) {
                        break b;
                    }
                }
                else {
                    ++i;
                    if (condition) {
                        continue c;
                    }
                }
            }
        }
    }
}

try {
    if (true) {
        throw child;
    }
}
catch (e) {
    if (e instanceof Parent) {
        console.log('parent');
    }
    else if (e instanceof Child) {
        console.log('child');
    }
    else {
        console.log(e);
    }
}
finally {
    console.log('fin');
}

try {
    throw 'err';
}
catch (e) {
    if (false) {
        console.log('pass');
    }
    else {
        throw e;
    }
}
finally {
    console.log('miss');
}
