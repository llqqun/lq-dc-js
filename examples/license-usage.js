/**
 * lq-dc-js 授权使用示例
 * 本示例展示如何正确设置授权密钥并使用库功能
 */

// 导入库
import lqDcJs, { license } from 'lq-dc-js';

// 示例1: 未授权状态下尝试使用库功能
console.log('=== 未授权状态 ===');
try {
  // 尝试使用未授权的功能将抛出错误
  const arr = [1, 2, 3, null, 4, undefined, 5];
  const result = lqDcJs.arrayUtils.compact(arr);
  console.log('结果:', result); // 不会执行到这里
} catch (error) {
  console.error('错误:', error.message);
}

// 示例2: 设置授权密钥
console.log('\n=== 设置授权密钥 ===');
// 设置有效的授权密钥 (实际使用时需要替换为开发者提供的真实密钥)
const isAuthorized = license.setLicenseKey('lq-abcdefghijklmnopqrstuvwxyz123456');
console.log('授权状态:', isAuthorized ? '成功' : '失败');

// 获取授权信息
const licenseInfo = license.getLicenseInfo();
console.log('授权信息:', {
  已授权: licenseInfo.isAuthorized,
  过期时间: licenseInfo.expirationDate
});

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

// 示例4: 配置授权模块
console.log('\n=== 配置授权模块 ===');
// 自定义授权配置
license.configureLicense({
  // 禁用控制台信息显示
  showConsoleInfo: false,
  // 自定义存储键名
  storageKey: 'my-custom-license-key',
  // 自定义过期时间 (7天)
  expirationTime: 7 * 24 * 60 * 60 * 1000
});

// 示例5: 清除授权
console.log('\n=== 清除授权 ===');
license.clearLicense();

// 检查授权状态
console.log('清除后授权状态:', license.isAuthorized() ? '已授权' : '未授权');

// 示例6: 在生产环境中禁用授权检查
console.log('\n=== 在生产环境中禁用授权检查 ===');
// 注意: 这通常在构建过程中通过环境变量控制，这里仅作演示
if (process.env.NODE_ENV === 'production') {
  license.configureLicense({
    enabled: false // 在生产环境中禁用授权检查
  });
}

console.log('\n=== 使用提示 ===');
console.log('1. 在应用初始化时尽早设置授权密钥');
console.log('2. 授权密钥应妥善保管，不要硬编码在公开的代码中');
console.log('3. 可以使用环境变量或配置文件存储授权密钥');
console.log('4. 在开发环境可以使用configureLicense({enabled:false})临时禁用授权检查');