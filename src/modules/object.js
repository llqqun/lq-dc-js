/**
 * 对象相关工具函数
 */

/**
 * 安全获取对象属性值，支持深层路径
 * @param {Object} obj - 要获取属性的对象
 * @param {string|Array} path - 属性路径，可以是点分隔的字符串或数组
 * @param {*} [defaultValue=null] - 当路径无效时返回的默认值
 * @returns {*} 属性值或默认值
 */
export function safeGet(obj, path, defaultValue = null) {
  // 防御性检查
  if (obj == null || typeof obj !== 'object') {
    return defaultValue;
  }
  
  // 路径处理
  const keys = Array.isArray(path) ? path : path.split('.');
  
  let result = obj;
  for (const key of keys) {
    if (result == null || typeof result !== 'object') {
      return defaultValue;
    }
    
    result = result[key];
    
    if (result === undefined) {
      return defaultValue;
    }
  }
  
  return result;
}

/**
 * 安全合并对象
 * @param {...Object} objects - 要合并的对象列表
 * @returns {Object} 合并后的新对象
 */
export function safeMerge(...objects) {
  const result = {};
  
  for (const obj of objects) {
    if (obj == null || typeof obj !== 'object') {
      continue;
    }
    
    for (const [key, value] of Object.entries(obj)) {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * 创建对象的深拷贝
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} 深拷贝后的新对象
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const cloned = {};
  for (const [key, value] of Object.entries(obj)) {
    cloned[key] = deepClone(value);
  }
  
  return cloned;
}