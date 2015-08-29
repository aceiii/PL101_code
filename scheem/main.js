
var PEG = require("pegjs");
var assert = require("assert");
var fs = require("fs");

var data = fs.readFileSync("scheem.peg", "utf-8");

//console.log(data);

var parse = PEG.buildParser(data).parse;

assert.deepEqual(parse("(a b c)"), ["a", "b", "c"]);

