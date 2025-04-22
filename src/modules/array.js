/**
 * 数组相关工具函数
 */

/**
 * 安全获取数组元素，防止越界访问
 * @param {Array} arr - 要操作的数组
 * @param {number} index - 索引位置
 * @param {*} [defaultValue=null] - 默认值，当索引无效时返回
 * @returns {*} 数组元素或默认值
 */
export function safeGet(arr, index, defaultValue = null) {
  // 防御性检查
  if (!Array.isArray(arr)) {
    return defaultValue;
  }
  
  // 索引检查
  if (index < 0 || index >= arr.length) {
    return defaultValue;
  }
  
  return arr[index];
}

/**
 * 移除数组中的重复元素
 * @param {Array} arr - 要操作的数组
 * @returns {Array} 去重后的新数组
 */
export function unique(arr) {
  if (!Array.isArray(arr)) {
    return [];
  }
  
  return [...new Set(arr)];
}

/**
 * 安全地将值包装为数组
 * @param {*} value - 任意值
 * @returns {Array} 包装后的数组
 */
export function ensureArray(value) {
  if (value === null || value === undefined) {
    return [];
  }
  
  return Array.isArray(value) ? value : [value];
}