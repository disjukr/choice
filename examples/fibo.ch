func fib(n) returns func (n, a, b) {
        return n > 0 ?
            @.callee(n - 1, b, a + b) : a;
    }(n, 0, 1);
