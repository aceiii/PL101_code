


// maybe some helper functions

var absexpr = function(time, expr) {
    return {
        tag: 'note',
        pitch: expr.pitch,
        dur: expr.dur,
        start: time
    };
};

var compile = function (musexpr, t) {
    // your code here

    var time = t;
    if (time === null || time === undefined) {
        time = 0;
    }

    if (musexpr.tag === 'note') {
        return [absexpr(time, musexpr)];
    } else if (musexpr.tag === 'seq') {
        var left = compile(musexpr.left, time);
        var last = left[left.length - 1];
        var right = compile(musexpr.right, last.start + last.dur);
        return left.concat(right);
    }
};

var endTime = function (time, expr) {
    // your code here

    if (expr.tag === 'note') {
        return time + expr.dur;
    } else if (expr.tag === 'seq') {
        return time + endTime(0, expr.left) + endTime(0, expr.right);
    }
};

var reverse = function(expr) {
    // Your code here

    if (expr.tag === 'note') {
        return expr;
    } else if (expr.tag === 'seq') {
        return {
            tag: 'seq',
            left: reverse(expr.right),
            right: reverse(expr.left)
        };
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

console.log(melody_mus);
console.log(compile(melody_mus));



