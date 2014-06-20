func fib(n) returns func (n, a, b) {
        return @.callee(n - 1, b, a + b) if n > 0;
        -> a;
    }(n, 0, 1);
