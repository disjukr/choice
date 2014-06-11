#!/usr/bin/env node

process.title = 'choice';

var choice = require('./choice.js');
var path = require('path');
var fs = require('fs');

var argv = process.argv.concat();
argv.splice(0, 2);

argv.forEach(function (arg) {
    var p = path.normalize(arg);
    var dir = path.dirname(p);
    var base = path.basename(p, '.ch');
    var source = fs.readFileSync(p, {encoding: 'utf8'});
    var result = choice.compile(source);
    var resultPath = path.join(dir, base + '.js');
    fs.writeFileSync(resultPath, result, {encoding: 'utf8'});
});
