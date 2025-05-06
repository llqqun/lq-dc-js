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

/**
 * 数组格式化成树形结构
 * @param {Array} arr - 要格式化的数组
 * @param {string} idKey - 唯一标识的键名
 * @param {string} parentKey - 父级标识的键名
 * @param {string} childrenKey - 子级数组的键名
 * @param {*} [rootValue=undefined] - 根节点的父级值，默认为undefined
 * @returns {Array} 格式化后的树形结构数组
 * @example
 * const data = [
 *   { id: 0, parentId: 0, name: '-A' },
 *   { id: 1, parentId: 0, name: 'A' },
 *   { id: 2, parentId: 1, name: 'B' },
 *   { id: 3, parentId: 1, name: 'C' },
 *   { id: 4, parentId: 2, name: 'D' },
 * ]
 */
export function formatTree(arr, idKey, parentKey, childrenKey, rootValue = undefined) {
  if (!Array.isArray(arr)) {
    return [];
  }

  const result = [];
  const map = {};

  // 构建映射表
  arr.forEach(item => {
    map[item[idKey]] = { ...item };
    // 确保每个节点都有children属性
    if (!map[item[idKey]][childrenKey]) {
      map[item[idKey]][childrenKey] = [];
    }
  });

  // 构建树形结构
  arr.forEach(item => {
    const parentId = item[parentKey];
    // 判断是否为根节点
    const isRoot = rootValue !== undefined 
      ? parentId === rootValue 
      : !map[parentId] || (item[idKey] === parentId);
    
    if (isRoot) {
      // 根节点直接加入结果数组
      result.push(map[item[idKey]]);
    } else {
      // 非根节点，添加到父节点的children中
      if (map[parentId]) {
        map[parentId][childrenKey].push(map[item[idKey]]);
      } else {
        // 找不到父节点时，作为根节点处理
        result.push(map[item[idKey]]);
      }
    }
  });

  return result;
}