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
    prefix = 'lq-91-0302',
    length = 36,
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
    console.log('generateLicenseKey', key, clientHash)
    const clientHashLength = clientHash.length;
    
    // 将客户端哈希插入到密钥中
    key = key.slice(0, length / 2) + clientHash + key.slice(length / 2, length - clientHashLength);
  }
  
  // 添加前缀
  return `${prefix}${key}`;
}

/**
 * 验证授权密钥是否有效
 * @param {string} key - 要验证的授权密钥
 * @param {Object} [options] - 验证选项
 * @param {string} [options.clientId] - 客户端标识，如果提供则验证密钥中是否包含此客户端的哈希
 * @returns {boolean} 密钥是否有效
 */
function validateLicenseKey(key, options = {}) {
  const { clientId = '' } = options;
  
  // 基本验证
  if (!key || typeof key !== 'string') {
    return false;
  }
  
  // 检查密钥前缀
  const expectedPrefix = 'lq-91-0302';
  if (!key.startsWith(expectedPrefix)) {
    return false;
  }
  console.log('val: PrefixPass')

  
  // 提取密钥部分（去除前缀）
  const keyPart = key.substring(expectedPrefix.length);
  
  // 检查密钥长度
  if (keyPart.length < 36) {
    return false;
  }
  console.log('val: lenPass', keyPart)
  
  // 如果提供了客户端ID，验证密钥中是否包含此客户端的哈希
  if (clientId) {
    const clientHash = crypto
      .createHash('md5')
      .update(clientId)
      .digest('hex')
      .slice(0, 8);
    
    // 检查客户端哈希是否在密钥的中间位置
    const middlePos = Math.floor(keyPart.length / 2);
    const keyMiddlePart = keyPart.substring(middlePos, middlePos + clientHash.length);
    if (keyMiddlePart !== clientHash) {
      return false;
    }
  }
  
  // 所有检查都通过
  return true;
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
    const clientId = args.find(arg => arg.startsWith('--id='))?.split('=')[1] || '';
    const isValid = validateLicenseKey(key, { clientId });
    console.log(`密钥 ${key} ${isValid ? '有效' : '无效'}`);
  } else {
    // 显示帮助
    console.log('\n=== lq-dc-js 授权密钥生成工具 ===');
    console.log('用法:');
    console.log('  node license-generator.js generate [选项]  生成新的授权密钥');
    console.log('  node license-generator.js validate <密钥> [选项]  验证授权密钥');
    console.log('\n选项:');
    console.log('  --name=<客户端名称>  设置客户端名称 (仅用于生成)');
    console.log('  --id=<客户端ID>     设置客户端唯一标识 (生成和验证均可用)');
    console.log('  --days=<天数>       设置授权有效天数（默认30天，仅用于生成）');
  }
}

module.exports = {
  generateLicenseKey,
  validateLicenseKey,
  generateLicense
};