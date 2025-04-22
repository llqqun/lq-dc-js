/**
 * 字符串相关工具函数
 */

/**
 * 确保输入值为字符串类型
 * @param {*} value - 任意输入值
 * @param {string} [defaultValue=''] - 当输入非字符串时返回的默认值
 * @returns {string} 处理后的字符串
 */
export function ensureString(value, defaultValue = '') {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  return typeof value === 'string' ? value : String(value);
}

/**
 * 安全截取字符串
 * @param {string} str - 要截取的字符串
 * @param {number} start - 起始位置
 * @param {number} [length] - 截取长度
 * @returns {string} 截取后的字符串
 */
export function safeSubstring(str, start, length) {
  const safeStr = ensureString(str);
  
  if (safeStr === '') {
    return '';
  }
  
  const safeStart = Math.max(0, parseInt(start) || 0);
  
  if (length === undefined) {
    return safeStr.substring(safeStart);
  }
  
  const safeLength = Math.max(0, parseInt(length) || 0);
  return safeStr.substring(safeStart, safeStart + safeLength);
}

/**
 * 检查字符串是否为空
 * @param {string} str - 要检查的字符串
 * @returns {boolean} 是否为空字符串
 */
export function isEmpty(str) {
  return ensureString(str).trim() === '';
}

/**
 * 安全格式化字符串，替换占位符
 * @param {string} template - 模板字符串，使用 {key} 作为占位符
 * @param {Object} values - 要替换的值
 * @returns {string} 格式化后的字符串
 */
export function format(template, values) {
  const safeTemplate = ensureString(template);
  
  if (!values || typeof values !== 'object') {
    return safeTemplate;
  }
  
  return safeTemplate.replace(/{([^{}]+)}/g, (match, key) => {
    const value = values[key];
    return value !== undefined ? String(value) : match;
  });
}