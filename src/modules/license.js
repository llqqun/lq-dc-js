
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
  expirationTime: 365 * 24 * 60 * 60 * 1000, // 365天
  // 是否在控制台显示授权信息
  showConsoleInfo: true,
  stopTime: 1849305600000 // 2028-08-08 00:00:00
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
 * 检查是否已授权
 * @returns {boolean} 是否已授权
 */
export function isAuthorized() {
  const currentTime = new Date().getTime();
  if (_licenseState.config.stopTime >= currentTime) {
    _licenseState.isAuthorized = true
    return true
  } else {
    _licenseState.isAuthorized = false
    return false
  }
}


// 导出授权模块
export default {
  config: _licenseState,
  isAuthorized
};