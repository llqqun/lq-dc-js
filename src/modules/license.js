/**
 * 授权管理模块
 * 提供库的授权验证、密钥管理等功能
 */

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
  showConsoleInfo: true
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
 * 验证授权密钥是否有效
 * @param {string} key - 授权密钥
 * @returns {boolean} 密钥是否有效
 * @private
 */
function _validateKey(key) {
  if (!key || typeof key !== 'string' || key.length < 32) {
    return false;
  }
  
  // 这里可以添加更复杂的密钥验证逻辑
  // 例如：密钥格式检查、签名验证等
  
  // 简单示例：检查密钥格式（以lq-开头的32位以上字符串）
  return /^lq-[\w\d]{28,}$/.test(key);
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
    // 验证存储的授权信息
    const isValid = _validateKey(storedLicense.licenseKey);
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
  } else {
    // 未找到授权信息
    _licenseState.isAuthorized = false;
    
    if (_licenseState.config.showConsoleInfo) {
      console.warn('lq-dc-js: 未授权，部分功能可能受限');
    }
  }
}

/**
 * 设置授权密钥
 * @param {string} licenseKey - 授权密钥
 * @returns {boolean} 设置是否成功
 */
export function setLicenseKey(licenseKey) {
  // 验证密钥
  if (!_validateKey(licenseKey)) {
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
    expirationDate: expirationDate.toISOString()
  });
  
  if (_licenseState.config.showConsoleInfo) {
    console.info(`lq-dc-js: 授权成功，过期时间: ${expirationDate.toLocaleString()}`);
  }
  
  return true;
}

/**
 * 检查是否已授权
 * @returns {boolean} 是否已授权
 */
export function isAuthorized() {
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
_initLicense();

// 导出授权模块
export default {
  setLicenseKey,
  isAuthorized,
  clearLicense,
  configureLicense,
  getLicenseInfo
};