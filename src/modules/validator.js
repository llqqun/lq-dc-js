/**
 * 数据验证相关工具函数
 */

/**
 * 检查值是否为空
 * 空值包括: null, undefined, '', [], {}
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }
  
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }
  
  return false;
}

/**
 * 检查值是否为数字
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为数字
 */
export function isNumber(value) {
  if (typeof value === 'number') {
    return !isNaN(value);
  }
  
  if (typeof value === 'string' && value.trim() !== '') {
    return !isNaN(Number(value));
  }
  
  return false;
}

/**
 * 检查值是否为整数
 * @param {*} value - 要检查的值
 * @returns {boolean} 是否为整数
 */
export function isInteger(value) {
  return isNumber(value) && Number.isInteger(Number(value));
}

/**
 * 检查值是否为有效的电子邮件地址
 * @param {string} value - 要检查的值
 * @returns {boolean} 是否为有效的电子邮件地址
 */
export function isEmail(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  // 简单的电子邮件验证正则表达式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
}

/**
 * 检查值是否为有效的URL
 * @param {string} value - 要检查的值
 * @returns {boolean} 是否为有效的URL
 */
export function isUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

/**
 * 检查值是否为有效的手机号码（中国大陆）
 * @param {string} value - 要检查的值
 * @returns {boolean} 是否为有效的手机号码
 */
export function isMobilePhone(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  // 中国大陆手机号码验证正则表达式
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(value);
}

/**
 * 检查值是否为有效的身份证号码（中国大陆）
 * @param {string} value - 要检查的值
 * @returns {boolean} 是否为有效的身份证号码
 */
export function isIdCard(value) {
  if (typeof value !== 'string') {
    return false;
  }
  
  // 支持15位和18位身份证号码
  const idCardRegex = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
  return idCardRegex.test(value);
}