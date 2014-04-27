// before translation
class Parent {
    new (whoami) {
        console.log(whoami);
    }
    a(b) {
        return b;
    };
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
    /xyz/ () {
        return field;
    }
}

new Child;

// after translation
function Parent() {
    var __this__ = this;
    var __index__ = [
        'a',
        /abc/
    ];
    var __value__ = [
        function (b) {
            return b;
        },
        'abc'
    ];
    __this__.__access__ = function (__field__) {
        for (var i = 0; i < __index__.length; ++i) {
            var index = __index__[i];
            if (__field__ === index) {
                return __value__[i];
            }
            if (index instanceof RegExp) {
                var field = index.exec(__field__);
                var value = __value__[i];
                if (typeof value === 'function') {
                    return value.bind(__this__, field);
                }
                return value;
            }
        }
        if (typeof __super__ !== 'undefined') {
            return __super__.__access__(__field__);
        }
        return undefined;
    }
    __this__.__init__ = function (whoami) {
        console.log(whoami);
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
            return __super__.__access__('a')(b);
        },
        1,
        2,
        function (field) {
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
                var value = __value__[i];
                if (typeof value === 'function') {
                    return value.bind(__this__, field);
                }
                return value;
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

(new Child()).__init__();
