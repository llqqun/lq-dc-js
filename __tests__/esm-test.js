/**
 * lq-dc-js ESM 测试脚本
 * 用于测试ESM版本的库
 * 注意：此脚本需要在支持ESM的环境中运行
 * 可以使用：node --experimental-modules esm-test.js
 * 或在支持ESM的打包工具中使用
 */

// 导入整个库
import lqDcJs from '../dist/index.esm.js';

// 或者按需导入特定模块
// import { arrayUtils, string, date } from '../dist/index.esm.js';

console.log('=== lq-dc-js ESM模块测试 ===');
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

// 按需导入示例
// 如果使用按需导入，代码会更简洁
// console.log('数组去重:', arrayUtils.unique(testArray));
// console.log('字符串格式化:', string.format('Hello, {name}!', {name: 'World'}));
// console.log('日期格式化:', date.format(new Date()));

console.log('ESM测试完成!');