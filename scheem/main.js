
var PEG = require("pegjs");
var assert = require("assert");
var fs = require("fs");
var path = require("path");

var data = fs.readFileSync(path.join(__dirname, "scheem.peg"), "utf-8");
//console.log(data);

var parse = PEG.buildParser(data).parse;

var chai = require("chai");
var assert = chai.assert;

assert.deepEqual(parse("(a b c)"), ["a", "b", "c"]);

// test whitespaces: space, multiple spaces, tabs, newlines
assert.deepEqual(parse("( a   b\t \tc)"), ["a", "b", "c"]);
assert.deepEqual(parse("(a\nb\nc)"), ["a", "b", "c"]);
assert.deepEqual(parse("(a\n\t b\n c)"), ["a", "b", "c"]);
assert.deepEqual(parse("(a \n(b c)\n d )"), ["a", ["b", "c"], "d"]);

assert.deepEqual(parse("'a"), ["quote", "a"]);
assert.deepEqual(parse("'(1 2 3)"), ["quote", ["1", "2", "3"]]);
assert.deepEqual(parse("'(a 1 \n( b 2)\t(c 3 ( d \t  4)))"), ["quote", ["a", "1", ["b", "2"], ["c", "3", ["d", "4"]]]]);

