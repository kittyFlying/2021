const { AsyncParallelHook, AsyncSeriesHook } = require('tapable');

/** 测试 SyncHook */

// SyncHook是个构造函数
// const queue = new AsyncParallelHook(['name']);

// 模拟一个接口
const getData = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(99);
		}, 2000);
	});
};
// console.time('cost');
// queue.tap('1', async function (name) {
// 	console.log(name, 1);
//     const data = await getData();
//     console.log(data);
//     return data;
// });
// queue.tap('2', function (name) {
// 	console.log(name, 2);
// });
// queue.tap('3', function (name) {
// 	console.log(name, 3);
// });

// 调用
// queue.callAsync('hi', err => {
//     console.timeEnd('cost');
// });

// 执行结果如下
// hi 1
// hi 2
// hi 3
// cost: 9.737ms
// 99

/** 测试 SyncHook end */

/** 测试 SyncWaterfallHook */

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
	// const data = await getData();
	// console.log(data);
	cb(1);
});
queue2.tapAsync('2', function (name, cb) {
	console.log(name, 2);
	cb(2);
});
queue2.tapAsync('3', function (name, cb) {
	console.log(name, 3);
	cb(3);
});


// 调用
queue2.callAsync('hi', (err) => {
	console.log(err);
});

// 执行结果如下
// hi 1
// hi 2
// hi 3
// undefined
// cost2: 10.296ms
// 99

/** 测试 SyncWaterfallHook end */
