/**
 * lq-dc-js 授权使用示例
 * 本示例展示如何正确设置授权密钥并使用库功能
 */

// 导入库
import lqDcJs from '../dist/index.esm.js';
const { license } = lqDcJs;
// 示例1: 未授权状态下尝试使用库功能
console.log('=== 未授权状态 ===');
try {
  // 尝试使用未授权的功能将抛出错误
  const arr = [1, 2, 3, null, 4, undefined, 5, 4];
  const result = lqDcJs.arrayUtils.unique(arr);
  console.log('结果:', result); // 不会执行到这里
} catch (error) {
  console.error('错误:', error.message);
}

console.log('\n=== 获取授权状态 ===');
const isAuthorized = license.isAuthorized();
console.log('授权状态:', isAuthorized ? '成功' : '失败');

// 示例3: 授权后使用库功能
console.log('\n=== 授权后使用库功能 ===');
try {
  // 现在可以正常使用库功能
  const arr = [1, 2, 3, null, 4, undefined, 5];
  const result = lqDcJs.arrayUtils.compact(arr);
  console.log('数组去除空值结果:', result); // [1, 2, 3, 4, 5]
  
  // 使用其他模块功能
  const str = '  Hello World  ';
  const trimmed = lqDcJs.string.trim(str);
  console.log('字符串修剪结果:', trimmed); // "Hello World"
} catch (error) {
  console.error('错误:', error.message); // 授权后不应该有错误
}


// 检查授权状态
console.log('清除后授权状态:', license.isAuthorized() ? '已授权' : '未授权');

// 示例6: 在生产环境中禁用授权检查
console.log('\n=== 在生产环境中禁用授权检查 ===');
// 注意: 这通常在构建过程中通过环境变量控制，这里仅作演示
if (process.env.NODE_ENV === 'production') {
}