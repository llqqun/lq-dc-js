/**
 * 授权管理模块
 * 提供库的授权验证、密钥管理等功能
 */
import { isBrowser, isNode } from './platform';

// 根据环境动态导入crypto
let crypto;
if (isNode()) {
  // Node.js环境使用原生crypto模块
  try {
    crypto = require('crypto');
  } catch (e) {
    console.warn('lq-dc-js: crypto模块加载失败，授权功能可能不可用');
    crypto = null;
  }
} else if (isBrowser()) {
  // 浏览器环境使用window.crypto
  if (window.crypto && window.crypto.subtle) {
    crypto = window.crypto;
  } else {
    console.warn('lq-dc-js: 当前浏览器不支持Web Crypto API，授权功能可能不可用');
    crypto = null;
  }
}
/**
 * 默认授权配置
 * @private
 */
const DEFAULT_CONFIG = {
  // 是否启用授权检查
  enabled: true,
  // 授权密钥存储的键名
  storageKey: 'lq-dc-js-license-key',
  // 授权过期时间（毫秒）
  expirationTime: 180 * 24 * 60 * 60 * 1000, // 180天
  // 是否在控制台显示授权信息
  showConsoleInfo: true,
  stopTime: 0
};

/**
 * 授权状态
 * @private
 */
let _licenseState = {
  // 是否已授权
  isAuthorized: false,
  // 授权密钥
  licenseKey: '',
  // 授权过期时间
  expirationDate: null,
  // 授权配置
  config: { ...DEFAULT_CONFIG }
};

/**
 * 在浏览器环境中使用Web Crypto API计算哈希
 * @param {string} data - 要哈希的数据
 * @returns {Promise<string>} 哈希值
 * @private
 */
async function _browserHash(data) {
  // 检查crypto是否可用
  if (!crypto || !crypto.subtle) {
    // 如果Web Crypto API不可用，使用简单的字符串哈希
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return (Math.abs(hash).toString(16).padStart(8, '0'));
  }
  
  try {
    // 将字符串转换为Uint8Array
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    // 使用Web Crypto API计算哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    // 将哈希值转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 由于浏览器不直接支持MD5，我们使用SHA-256并截取前16个字符模拟MD5长度
    return hashHex.slice(0, 32);
  } catch (e) {
    console.warn('lq-dc-js: 哈希计算失败', e);
    // 返回一个备用哈希
    return 'ffffffff';
  }
}

/**
 * 计算客户端ID的哈希值
 * @param {string} clientId - 客户端ID
 * @returns {string} 哈希值
 * @private
 */
function _getClientHash(clientId) {
  if (isBrowser()) {
    // 浏览器环境下，使用_browserHash函数
    // 由于_browserHash是异步的，但我们需要同步返回
    // 这里使用同步版本，实际项目中可以考虑改为异步验证
    let hash = 0;
    for (let i = 0; i < clientId.length; i++) {
      const char = clientId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    // 转换为16进制字符串并取前8位
    return (Math.abs(hash).toString(16).padStart(8, '0')).slice(0, 8);
  } else if (isNode() && crypto) {
    // Node.js环境使用crypto模块
    try {
      return crypto
        .createHash('md5')
        .update(clientId)
        .digest('hex')
        .slice(0, 8);
    } catch (e) {
      console.warn('lq-dc-js: MD5哈希计算失败', e);
    }
  }
  // 如果无法计算哈希，返回一个固定值
  return 'ffffffff';
}

/**
 * 验证授权密钥是否有效
 * @param {string} key - 授权密钥
 * @returns {boolean} 密钥是否有效
 * @private
 */
function _validateKey(key, clientId = '') {
  try {
    // 基本验证
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    // 检查密钥前缀
    const expectedPrefix = 'lq-91-0302';
    if (!key.startsWith(expectedPrefix)) {
      return false;
    }
    
    // 提取密钥部分（去除前缀）
    const keyPart = key.substring(expectedPrefix.length);
    
    // 检查密钥长度
    if (keyPart.length !== 36) {
      return false;
    }
    
    // 如果提供了客户端ID，验证密钥中是否包含此客户端的哈希
    if (clientId) {
      const clientHash = _getClientHash(clientId);
      console.log(clientHash)
      console.log(_browserHash(clientHash))
      // 检查客户端哈希是否在密钥的中间位置
      const middlePos = Math.floor(keyPart.length / 2);
      const keyMiddlePart = keyPart.substring(middlePos, middlePos + clientHash.length);
      if (keyMiddlePart !== clientHash) {
        return false;
      }
    } else {
      // 如果未提供客户端ID
      return false
    }
    
    // 所有检查都通过
    return true;
  } catch (error) {
    console.error('lq-dc-js: 验证授权密钥时发生错误', error);
    return false;
  }
}

/**
 * 检查授权是否过期
 * @param {Date} expirationDate - 过期日期
 * @returns {boolean} 是否已过期
 * @private
 */
function _isExpired(expirationDate) {
  if (!expirationDate || !(expirationDate instanceof Date)) {
    return true;
  }
  
  return new Date() > expirationDate;
}

/**
 * 从存储中获取授权信息
 * @returns {Object|null} 授权信息对象或null
 * @private
 */
function _getLicenseFromStorage() {
  try {
    // 尝试从localStorage获取（浏览器环境）
    if (typeof localStorage !== 'undefined') {
      const storedData = localStorage.getItem(_licenseState.config.storageKey);
      if (storedData) {
        return JSON.parse(storedData);
      }
    }
    
    // 其他环境可以扩展其他存储方式
    // 例如：Node.js环境可以从文件或环境变量读取
    
    return null;
  } catch (error) {
    console.error('Failed to get license from storage:', error);
    return null;
  }
}

/**
 * 将授权信息保存到存储
 * @param {Object} licenseInfo - 授权信息对象
 * @private
 */
function _saveLicenseToStorage(licenseInfo) {
  try {
    // 尝试保存到localStorage（浏览器环境）
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        _licenseState.config.storageKey,
        JSON.stringify(licenseInfo)
      );
    }
    
    // 其他环境可以扩展其他存储方式
    // 例如：Node.js环境可以保存到文件
  } catch (error) {
    console.error('Failed to save license to storage:', error);
  }
}

/**
 * 初始化授权模块
 * @param {Object} [config] - 授权配置
 * @private
 */
function _initLicense(config = {}) {
  try {
    // 合并配置
    _licenseState.config = { ...DEFAULT_CONFIG, ...config };
    
    // 如果禁用授权检查，直接返回
    if (!_licenseState.config.enabled) {
      _licenseState.isAuthorized = true;
      return;
    }
    
    // 尝试从存储中恢复授权信息
    const storedLicense = _getLicenseFromStorage();
    if (storedLicense && storedLicense.licenseKey) {
      try {
        // 验证存储的授权信息
        const isValid = _validateKey(storedLicense.licenseKey, storedLicense.clientId);
        const expirationDate = new Date(storedLicense.expirationDate);
        const isNotExpired = !_isExpired(expirationDate);
        
        if (isValid && isNotExpired) {
          _licenseState.isAuthorized = true;
          _licenseState.licenseKey = storedLicense.licenseKey;
          _licenseState.expirationDate = expirationDate;
          
          // 显示授权信息
          if (_licenseState.config.showConsoleInfo) {
            console.info(`lq-dc-js: 授权有效，过期时间: ${expirationDate.toLocaleString()}`);
          }
        } else {
          // 授权无效或已过期
          _licenseState.isAuthorized = false;
          
          if (_licenseState.config.showConsoleInfo) {
            console.warn('lq-dc-js: 授权已过期或无效，请重新授权');
          }
        }
      } catch (validationError) {
        // 验证过程中出错
        console.error('lq-dc-js: 验证存储的授权信息时出错', validationError);
        _licenseState.isAuthorized = false;
      }
    } else {
      // 未找到授权信息
      _licenseState.isAuthorized = false;
      
      if (_licenseState.config.showConsoleInfo) {
        console.warn('lq-dc-js: 未授权，部分功能可能受限');
      }
    }
  } catch (error) {
    // 初始化过程中出现错误，确保授权状态为已授权，避免功能受限
    console.error('lq-dc-js: 初始化授权模块时出错，将默认为已授权状态', error);
    _licenseState.isAuthorized = true;
  }
}

/**
 * 设置授权密钥
 * @param {string} licenseKey - 授权密钥
 * @returns {boolean} 设置是否成功
 */
export function setLicenseKey(licenseKey, clientId = '') {
  try {
    // 验证密钥
    if (!_validateKey(licenseKey, clientId)) {
      if (_licenseState.config.showConsoleInfo) {
        console.error('lq-dc-js: 无效的授权密钥');
      }
      return false;
    }
    
    // 计算过期时间
    const expirationDate = new Date(
      Date.now() + _licenseState.config.expirationTime
    );
    
    // 更新授权状态
    _licenseState.isAuthorized = true;
    _licenseState.licenseKey = licenseKey;
    _licenseState.expirationDate = expirationDate;
    
    // 保存到存储
    _saveLicenseToStorage({
      licenseKey,
      clientId,
      expirationDate: expirationDate.toISOString()
    });
    
    if (_licenseState.config.showConsoleInfo) {
      console.info(`lq-dc-js: 授权成功，过期时间: ${expirationDate.toLocaleString()}`);
    }
    
    return true;
  } catch (error) {
    console.error('lq-dc-js: 设置授权密钥时发生错误', error);
    // 出错时，确保授权状态为未授权
    _licenseState.isAuthorized = false;
    return false;
  }
}

/**
 * 检查是否已授权
 * @returns {boolean} 是否已授权
 */
export function isAuthorized() {
  const currentTime = new Date().getTime();
  console.log(DEFAULT_CONFIG.stopTime, currentTime,currentTime - DEFAULT_CONFIG.stopTime)
  if (DEFAULT_CONFIG.stopTime >= currentTime) {
    _licenseState.isAuthorized = true
    return true
  } else {
    _licenseState.isAuthorized = false
    return false
  }
  try {
    // 如果禁用授权检查，始终返回true
    if (!_licenseState.config.enabled) {
      return true;
    }
    
    // 检查授权状态
    if (_licenseState.isAuthorized && _licenseState.expirationDate) {
      // 检查是否过期
      if (_isExpired(_licenseState.expirationDate)) {
        _licenseState.isAuthorized = false;
        
        if (_licenseState.config.showConsoleInfo) {
          console.warn('lq-dc-js: 授权已过期，请重新授权');
        }
        
        return false;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    // 出现错误时，为了避免功能受限，返回已授权状态
    console.error('lq-dc-js: 检查授权状态时出错，将默认为已授权状态', error);
    return true;
  }
}

/**
 * 清除授权信息
 */
export function clearLicense() {
  _licenseState.isAuthorized = false;
  _licenseState.licenseKey = '';
  _licenseState.expirationDate = null;
  
  try {
    // 清除存储的授权信息
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(_licenseState.config.storageKey);
    }
    
    if (_licenseState.config.showConsoleInfo) {
      console.info('lq-dc-js: 授权已清除');
    }
  } catch (error) {
    console.error('Failed to clear license:', error);
  }
}

/**
 * 配置授权模块
 * @param {Object} config - 授权配置
 */
export function configureLicense(config = {}) {
  // 更新配置
  _licenseState.config = { ..._licenseState.config, ...config };
  
  // 如果禁用授权检查，直接设置为已授权
  if (!_licenseState.config.enabled) {
    _licenseState.isAuthorized = true;
  }
}

/**
 * 获取授权信息
 * @returns {Object} 授权信息
 */
export function getLicenseInfo() {
  return {
    isAuthorized: isAuthorized(),
    expirationDate: _licenseState.expirationDate,
    config: { ..._licenseState.config }
  };
}

// 初始化授权模块
// _initLicense();

// 导出授权模块
export default {
  config: DEFAULT_CONFIG,
  setLicenseKey,
  isAuthorized,
  clearLicense,
  configureLicense,
  getLicenseInfo
};