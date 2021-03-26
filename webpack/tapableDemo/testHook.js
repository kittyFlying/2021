const { SyncHook, SyncWaterfallHook } = require('tapable');

/** 测试 SyncHook */

// SyncHook是个构造函数
const queue = new SyncHook(['name']);

// 模拟一个接口
const getData = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(99);
        },2000);
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
// queue.call('hi');

// 执行结果如下
// hi 1
// hi 2
// hi 3
// 99

/** 测试 SyncHook end */

/** 测试 SyncWaterfallHook */

// SyncHook是个构造函数
const queue2 = new SyncWaterfallHook(['name']);


queue2.tap('1', async function (name) {
	console.log(name, 1);
    const data = await getData();
    console.log(data);
    return data;
});
queue2.tap('2', function (data) {
	console.log(data, 2);
    return 2;
});
queue2.tap('3', function (data) {
	console.log(data, 3);
});

// 调用
queue2.call('hi');

// 执行结果如下
// hi 1
// Promise { <pending> } 2
// 2 3
// 99

/** 测试 SyncWaterfallHook end */

