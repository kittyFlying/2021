const { AsyncParallelHook, AsyncSeriesHook } = require('tapable');

// SyncHook是个构造函数
const queue = new AsyncParallelHook(['name']);

// 模拟一个接口
const getData = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(99);
		}, 2000);
	});
};

queue.tap('1', async function (name) {
	console.log(name, 1);
	const data = await getData();
	console.log(data);
	return data;
});
queue.tap('2', function (name) {
	console.log(name, 2);
});
queue.tap('3', function (name) {
	console.log(name, 3);
});

// 调用
// queue.callAsync('hi', err => {
// 	console.log(err);
// });

// 执行结果如下
// hi 1
// hi 2
// hi 3
// cost: 9.737ms
// 99

// SyncHook是个构造函数
const queue2 = new AsyncSeriesHook(['name']);

// queue2.tap('1', async function (name) {
// 	console.log(name, 1);
//     const data = await getData();
//     console.log(data);
//     return data;
// });
// queue2.tap('2', function (name) {
// 	console.log(name, 2);
//     return 2;
// });
// queue2.tap('3', function (name) {
// 	console.log(name, 3);
// });

queue2.tapAsync('1', async function (name, cb) {
	console.log(name, 1);
	const data = await getData();
	console.log(data);
	cb();
});
queue2.tapAsync('2', function (name, cb) {
	console.log(name, 2);
	cb();
});
queue2.tapAsync('3', function (name, cb) {
	console.log(name, 3);
	cb();
});

// 调用
// queue2.callAsync('hi', (err) => {
// 	console.log(err);
// });

// 执行结果如下
// hi 1
// 99
// hi 2
// hi 3
// undefined

let queue3 = new AsyncParallelHook(['name']);
queue3.tapPromise('1', function (name, cb) {
	return new Promise(function (resolve, reject) {
		setTimeout(() => {
			console.log(name, 1);
			resolve();
		}, 1000);
	});
});

queue3.tapPromise('1', function (name, cb) {
	return new Promise(function (resolve, reject) {
		console.log(name, 2);
		resolve();
	});
});

queue3.tapPromise('1', function (name, cb) {
	return new Promise(function (resolve, reject) {
		console.log(name, 3);
		resolve();
	});
});

queue3.promise('hi').then(
	() => {},
	() => {}
);

class AsyncSeriesHook {
    constructor() {
        this.hooks = [];
    }

    tapAsync(name, fn) {
        this.hooks.push(fn);
    }

    callAsync() {
        var slef = this;
        var args = Array.from(arguments);
        let done = args.pop();
        let idx = 0;

        function next(err) {
            // 如果next的参数有值，就直接跳跃到 执行callAsync的回调函数
            if (err) return done(err);
            let fn = slef.hooks[idx++];
            fn ? fn(...args, next) : done();
        }
        next();
    }
}