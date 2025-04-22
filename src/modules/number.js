/**
 * 数字相关工具函数
 */

/**
 * 确保输入值为数字类型
 * @param {*} value - 任意输入值
 * @param {number} [defaultValue=0] - 当输入非数字或无效数字时返回的默认值
 * @returns {number} 处理后的数字
 */
export function ensureNumber(value, defaultValue = 0) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * 限制数字在指定范围内
 * @param {number} num - 要限制的数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 限制后的数字
 */
export function clamp(num, min, max) {
  const safeNum = ensureNumber(num);
  const safeMin = ensureNumber(min);
  const safeMax = ensureNumber(max);
  
  return Math.min(Math.max(safeNum, safeMin), safeMax);
}

/**
 * 安全的四舍五入，避免JavaScript浮点数精度问题
 * @param {number} num - 要四舍五入的数字
 * @param {number} [precision=0] - 小数位数
 * @returns {number} 四舍五入后的数字
 */
export function round(num, precision = 0) {
  const safeNum = ensureNumber(num);
  const safePrecision = Math.max(0, Math.floor(ensureNumber(precision)));
  
  const factor = Math.pow(10, safePrecision);
  return Math.round(safeNum * factor) / factor;
}

/**
 * 安全的数字格式化
 * @param {number} num - 要格式化的数字
 * @param {number} [precision=2] - 小数位数
 * @param {string} [thousandsSeparator=','] - 千位分隔符
 * @returns {string} 格式化后的数字字符串
 */
export function format(num, precision = 2, thousandsSeparator = ',') {
  const safeNum = ensureNumber(num);
  const safePrecision = Math.max(0, Math.floor(ensureNumber(precision)));
  
  // 处理小数部分
  const fixed = safeNum.toFixed(safePrecision);
  
  // 添加千位分隔符
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
  
  return parts.join('.');
}