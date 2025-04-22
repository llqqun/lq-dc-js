/**
 * 平台检测相关工具函数
 * 用于识别当前运行环境，支持浏览器、Node.js、小程序等多平台
 */

// 运行环境类型常量
export const ENV_TYPE = {
  BROWSER: 'browser',
  NODE: 'node',
  MINIPROGRAM: 'miniprogram',
  UNKNOWN: 'unknown'
};

/**
 * 获取当前运行环境
 * @returns {string} 环境类型，值为 ENV_TYPE 中的一个
 */
export function getEnvType() {
  // 检测浏览器环境
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // 检测是否为微信小程序环境
    if (
      typeof wx !== 'undefined' && 
      typeof wx.getSystemInfo === 'function' &&
      typeof window.__wxjs_environment !== 'undefined' && 
      window.__wxjs_environment === 'miniprogram'
    ) {
      return ENV_TYPE.MINIPROGRAM;
    }
    
    // 普通浏览器环境
    return ENV_TYPE.BROWSER;
  }
  
  // 检测 Node.js 环境
  if (typeof process !== 'undefined' && process.versions && process.versions.node) {
    return ENV_TYPE.NODE;
  }
  
  // 其他未知环境
  return ENV_TYPE.UNKNOWN;
}

/**
 * 检查是否为浏览器环境
 * @returns {boolean} 是否为浏览器环境
 */
export function isBrowser() {
  return getEnvType() === ENV_TYPE.BROWSER;
}

/**
 * 检查是否为 Node.js 环境
 * @returns {boolean} 是否为 Node.js 环境
 */
export function isNode() {
  return getEnvType() === ENV_TYPE.NODE;
}

/**
 * 检查是否为小程序环境
 * @returns {boolean} 是否为小程序环境
 */
export function isMiniProgram() {
  return getEnvType() === ENV_TYPE.MINIPROGRAM;
}

/**
 * 获取当前浏览器信息（仅在浏览器环境中有效）
 * @returns {Object|null} 浏览器信息对象或 null
 */
export function getBrowserInfo() {
  if (!isBrowser()) {
    return null;
  }
  
  const ua = navigator.userAgent;
  const browserInfo = {
    userAgent: ua,
    name: '',
    version: '',
    isMobile: /Mobile|Android|iPhone|iPad|iPod/i.test(ua)
  };
  
  // 检测常见浏览器
  if (/Edge\/|Edg\//.test(ua)) {
    browserInfo.name = 'Edge';
  } else if (/Chrome\//.test(ua)) {
    browserInfo.name = 'Chrome';
  } else if (/Firefox\//.test(ua)) {
    browserInfo.name = 'Firefox';
  } else if (/Safari\//.test(ua) && !/Chrome\//.test(ua)) {
    browserInfo.name = 'Safari';
  } else if (/MSIE|Trident\//.test(ua)) {
    browserInfo.name = 'IE';
  }
  
  // 提取版本号
  const versionMatch = ua.match(new RegExp(`${browserInfo.name}\/([\\d.]+)`));
  if (versionMatch && versionMatch[1]) {
    browserInfo.version = versionMatch[1];
  }
  
  return browserInfo;
}