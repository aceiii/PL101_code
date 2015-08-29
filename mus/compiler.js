

var absexpr = function(time, expr) {
    return {
        tag: 'note',
        pitch: convertPitch(expr.pitch),
        dur: expr.dur,
        start: time
    };
};

var noteIndex = function(note) {
    switch(note) {
        case "c": return 0;
        case "d": return 2;
        case "e": return 4;
        case "f": return 5;
        case "g": return 7;
        case "a": return 9;
        case "b": return 11;
    }
    return -1;
}
var convertPitch = function(name) {
    var s = name.toLowerCase().split("");
    var note = noteIndex(s[0]);
    var num = parseInt(s[1]);
    return 12 + (note + (12 * num));
};

var compile = function (musexpr, t) {

    var time = t;
    if (time === null || time === undefined) {
        time = 0;
    }

    if (musexpr.tag === 'note') {
        return [absexpr(time, musexpr)];
    } else if (musexpr.tag === 'seq') {
        var left = compile(musexpr.left, time);
        var right = compile(musexpr.right, endTime(time, musexpr.left));
        return left.concat(right);
    } else if (musexpr.tag === 'par') {
        left = compile(musexpr.left, time);
        right = compile(musexpr.right, time);
        return left.concat(right);
    } else if (musexpr.tag === 'repeat') {
        var i = musexpr.count;
        var tt = time;
        var result = [];
        while (i > 0) {
            i -= 1;
            result = result.concat(compile(musexpr.section, tt));
            tt = endTime(tt, musexpr.section);
        }
        return result;
    } else {
        return [];
    }
};

var endTime = function (time, expr) {

    if (expr === null || expr === undefined) {
        return 0;
    }

    if (expr.tag === 'note') {
        return time + expr.dur;
    } else if (expr.tag === 'seq') {
        return time + endTime(0, expr.left) + endTime(0, expr.right);
    } else if (expr.tag === 'par') {
        return time + Math.max(endTime(0, expr.left), endTime(0, expr.right));
    } else if (expr.tag === 'rest') {
        return time + expr.duration;
    } else if (expr.tag === 'repeat') {
        var dur = endTime(0, expr.section);
        return time + (dur * expr.count);
    } else {
        console.log("endTime: unknown tag ", expr.tag);
        return 0;
    }
};

var reverse = function(expr) {
    if (expr.tag === 'seq' || expr.tag === 'par') {
        return {
            tag: 'seq',
            left: reverse(expr.right),
            right: reverse(expr.left)
        };
    } else {
        return expr;
    }
};


var melody_mus = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: { tag: 'note', pitch: 'b4', dur: 250 },
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
};

var melody_mus2 = {
    tag: 'seq',
    left: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: { tag: 'rest', duration: 120 },
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
};

var melody_mus3 = {
    tag: 'seq',
    left: {
        tag: 'par',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: { tag: 'rest', duration: 120 },
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
}

var melody_mus4 = {
    tag: 'seq',
    left: {
        tag: 'par',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right: {
            tag: 'repeat',
            section: {
                tag: 'seq',
                left: { tag: 'note', pitch: 'c0', dur: 150 },
                right: { tag: 'note', pitch: 'c1', dur: 150 },
            },
            count: 3
        },
    },
    right: {
        tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 }
    }
}

console.log(melody_mus);
console.log(compile(melody_mus));
console.log("\n")

console.log(melody_mus2);
console.log(compile(melody_mus2));
console.log("\n");

console.log(melody_mus3);
console.log(compile(melody_mus3));
console.log("\n");

console.log(melody_mus4);
console.log(compile(melody_mus4));
console.log("\n");
