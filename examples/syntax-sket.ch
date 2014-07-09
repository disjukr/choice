# this
// is
/* comment */

var a = 123.456e+789;
val b = 'string';
const c = "constant";

var d = match (num) {
    = 1              -> 2,
    3 ~ 4            -> 5,
    6 | 7            -> 8,
    {expression}     -> 9,
    {10} ~ {11}      -> 12,
    {13} | 14 | {15} -> 16,
    (17, 18)         -> 19,
    (20, 21]         -> 22,
    [23, 24)         -> 25,
    [26, 27]         -> 28,
    29
};

if (condition) statement;
if (condition) {
    statements;
}

loop statement;
loop {
    statements;
}
loop label {
    continue label;
    break label if condition;
}

while (condition) statement;
while label (condition) statement;
while (condition) {
    statements;
}
while label (condition) {
    statements;
}

for (var i = 0; i < 10; ++i)
    console.log(i);

for (var i in [1, 2, 3])
    console.log(i); // 0, 1, 2

for (var key, value in {a: 1, b: 2, c: 3})
    console.log(key, value);
