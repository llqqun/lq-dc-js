/**
 * lq-dc-js Node.js 测试脚本
 * 用于测试CommonJS版本的库
 */

// 导入库
const lqDcJs = require('../dist/index.cjs.js');

console.log('=== lq-dc-js 库测试 ===');
console.log('库导出对象:', Object.keys(lqDcJs));
console.log('\n');

// 测试数组工具
console.log('=== 数组工具测试 ===');
const testArray = [1, 2, 2, 3, 4, 5, 5];
console.log('原始数组:', testArray);
console.log('安全获取索引2的值:', lqDcJs.arrayUtils.safeGet(testArray, 2));
console.log('安全获取索引10的值(默认null):', lqDcJs.arrayUtils.safeGet(testArray, 10));
console.log('数组去重:', lqDcJs.arrayUtils.unique(testArray));
console.log('确保数组:', lqDcJs.arrayUtils.ensureArray('test'));
console.log('\n');

// 测试字符串工具
console.log('=== 字符串工具测试 ===');
console.log('确保字符串:', lqDcJs.string.ensureString(123));
console.log('安全截取字符串:', lqDcJs.string.safeSubstring('Hello World', 0, 5));
console.log('字符串是否为空:', lqDcJs.string.isEmpty(''), lqDcJs.string.isEmpty('Hello'));
console.log('字符串格式化:', lqDcJs.string.format('Hello, {name}!', {name: 'World'}));
console.log('\n');

// 测试日期工具
console.log('=== 日期工具测试 ===');
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
console.log('当前日期格式化:', lqDcJs.date.format(today));
console.log('自定义格式化:', lqDcJs.date.format(today, 'YYYY年MM月DD日'));
console.log('两个日期之间的天数:', lqDcJs.date.daysBetween(today, nextWeek));
console.log('日期是否在范围内:', lqDcJs.date.isInRange(today, today, nextWeek));
console.log('\n');

// 测试平台检测
console.log('=== 平台检测测试 ===');
console.log('当前环境类型:', lqDcJs.platform.getEnvType());
console.log('是否在浏览器中:', lqDcJs.platform.isBrowser());
console.log('是否在Node.js中:', lqDcJs.platform.isNode());
console.log('是否在小程序中:', lqDcJs.platform.isMiniProgram());
console.log('\n');

// 测试数字工具
console.log('=== 数字工具测试 ===');
console.log('确保数字:', lqDcJs.number.ensureNumber('123'));
console.log('限制数字范围:', lqDcJs.number.clamp(150, 0, 100));
console.log('四舍五入到指定精度:', lqDcJs.number.round(3.14159, 2));
console.log('格式化数字:', lqDcJs.number.format(1234567.89));
console.log('\n');

// 测试对象工具
console.log('=== 对象工具测试 ===');
const testObj = { a: { b: { c: 42 } } };
console.log('安全获取对象属性:', lqDcJs.object.safeGet(testObj, 'a.b.c'));
console.log('安全获取不存在的属性:', lqDcJs.object.safeGet(testObj, 'a.b.d', '默认值'));

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
console.log('安全合并对象:', lqDcJs.object.safeMerge(obj1, obj2));

const complexObj = { a: 1, b: { c: 3 }, d: [1, 2, 3] };
const clonedObj = lqDcJs.object.deepClone(complexObj);
console.log('深度克隆对象:', clonedObj);
console.log('克隆对象与原对象是否相同:', complexObj === clonedObj);
console.log('\n');

console.log('测试完成!');