/**
 * lq-dc-js 授权密钥生成工具
 * 用于生成有效的授权密钥
 */

const crypto = require('crypto');

/**
 * 生成授权密钥
 * @param {Object} options - 生成选项
 * @param {string} [options.prefix='lq-'] - 密钥前缀
 * @param {number} [options.length=32] - 密钥长度（不包括前缀）
 * @param {string} [options.clientId] - 客户端标识
 * @returns {string} 生成的授权密钥
 */
function generateLicenseKey(options = {}) {
  const {
    prefix = 'lq-',
    length = 32,
    clientId = ''
  } = options;
  
  // 生成随机字节
  const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
  
  // 转换为十六进制字符串
  let key = randomBytes.toString('hex').slice(0, length);
  
  // 如果提供了客户端ID，将其混入密钥中
  if (clientId) {
    const clientHash = crypto
      .createHash('md5')
      .update(clientId)
      .digest('hex')
      .slice(0, 8);
    
    // 将客户端哈希插入到密钥中
    key = key.slice(0, length / 2) + clientHash + key.slice(length / 2 + 8);
  }
  
  // 添加前缀
  return `${prefix}${key}`;
}

/**
 * 验证授权密钥是否有效
 * @param {string} key - 要验证的授权密钥
 * @returns {boolean} 密钥是否有效
 */
function validateLicenseKey(key) {
  if (!key || typeof key !== 'string') {
    return false;
  }
  
  // 检查密钥格式（以lq-开头的32位以上字符串）
  return /^lq-[\w\d]{28,}$/.test(key);
}

/**
 * 生成带有过期时间的授权密钥对象
 * @param {Object} options - 生成选项
 * @param {string} [options.clientName] - 客户端名称
 * @param {string} [options.clientId] - 客户端标识
 * @param {number} [options.validDays=30] - 有效天数
 * @returns {Object} 授权密钥对象
 */
function generateLicense(options = {}) {
  const {
    clientName = 'Unknown Client',
    clientId = Date.now().toString(),
    validDays = 30
  } = options;
  
  // 生成密钥
  const licenseKey = generateLicenseKey({ clientId });
  
  // 计算过期时间
  const issueDate = new Date();
  const expirationDate = new Date(issueDate);
  expirationDate.setDate(expirationDate.getDate() + validDays);
  
  return {
    licenseKey,
    clientName,
    clientId,
    issueDate: issueDate.toISOString(),
    expirationDate: expirationDate.toISOString(),
    validDays
  };
}

// 命令行接口
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'generate') {
    // 解析参数
    const clientName = args.find(arg => arg.startsWith('--name='))?.split('=')[1] || 'Client';
    const clientId = args.find(arg => arg.startsWith('--id='))?.split('=')[1] || Date.now().toString();
    const validDays = parseInt(args.find(arg => arg.startsWith('--days='))?.split('=')[1] || '30', 10);
    
    // 生成授权
    const license = generateLicense({ clientName, clientId, validDays });
    
    console.log('\n=== lq-dc-js 授权密钥 ===');
    console.log(JSON.stringify(license, null, 2));
    console.log('\n使用方法:');
    console.log(`license.setLicenseKey('${license.licenseKey}');`);
    console.log('\n注意: 请妥善保管此密钥，不要泄露给未授权用户');
  } else if (command === 'validate') {
    // 验证密钥
    const key = args[1];
    const isValid = validateLicenseKey(key);
    console.log(`密钥 ${key} ${isValid ? '有效' : '无效'}`);
  } else {
    // 显示帮助
    console.log('\n=== lq-dc-js 授权密钥生成工具 ===');
    console.log('用法:');
    console.log('  node license-generator.js generate [选项]  生成新的授权密钥');
    console.log('  node license-generator.js validate <密钥>  验证授权密钥');
    console.log('\n选项:');
    console.log('  --name=<客户端名称>  设置客户端名称');
    console.log('  --id=<客户端ID>     设置客户端唯一标识');
    console.log('  --days=<天数>       设置授权有效天数（默认30天）');
  }
}

module.exports = {
  generateLicenseKey,
  validateLicenseKey,
  generateLicense
};