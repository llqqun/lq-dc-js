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
export function deepClone(target, seen = new WeakMap()) {
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 已处理的循环引用
  if (seen.has(target)) return seen.get(target);

  if (target instanceof Date) return new Date(target.getTime());
  
  if (target instanceof RegExp) {
    const flags = target.flags || (target.global ? 'g' : '') + (target.ignoreCase ? 'i' : '') + (target.multiline ? 'm' : '') + (target.unicode ? 'u' : '') + (target.sticky ? 'y' : '');
    return new RegExp(target.source, flags);
  }

  if (target instanceof ArrayBuffer) return target.slice(0);

  if (ArrayBuffer.isView(target)) {
    // 包含 DataView 与各 TypedArray
    if (target instanceof DataView) {
      return new DataView(target.buffer.slice(0), target.byteOffset, target.byteLength);
    }
    const ctor = target.constructor;
    return new ctor(target); // 构造器会复制底层 buffer 的一份视图（同类型）
  }

  if (target instanceof Map) {
    const result = new Map();
    seen.set(target, result);
    for (const [k, v] of target.entries()) {
      result.set(deepClone(k, seen), deepClone(v, seen));
    }
    return result;
  }

  if (target instanceof Set) {
    const result = new Set();
    seen.set(target, result);
    for (const v of target.values()) {
      result.add(deepClone(v, seen));
    }
    return result;
  }

  if (target instanceof Error) {
    const name = target.name || 'Error';
    const msg = target.message || '';
    const ErrCtor = target.constructor && typeof target.constructor === 'function' ? target.constructor : Error;
    const result = new ErrCtor(msg);
    seen.set(target, result);
    // 拷贝自定义属性
    copyProperties(target, result, seen);
    return result;
  }

  // 处理普通对象或数组
  const proto = Object.getPrototypeOf(target);
  const cloneObj = Object.create(proto);
  // 处理循环引用
  seen.set(target, cloneObj);

  // 通过属性描述符拷贝所有 own 属性（包含不可枚举与 symbol）
  const descriptors = Object.getOwnPropertyDescriptors(target);
  for (const [key, descriptor] of Object.entries(descriptors)) {
    if ('value' in descriptor) {
      descriptor.value = deepClone(descriptor.value, seen);
    }
    Object.defineProperty(cloneObj, key, descriptor);
  }
  // 同时处理 symbol 属性
  const symbolKeys = Object.getOwnPropertySymbols(target);
  for (const sym of symbolKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(target, sym);
    if (descriptor) {
      if ('value' in descriptor) descriptor.value = deepClone(descriptor.value, seen);
      Object.defineProperty(cloneObj, sym, descriptor);
    }
  }

  return cloneObj;
}

function copyProperties(src, dest, seen) {
  const descriptors = Object.getOwnPropertyDescriptors(src);
  for (const [k, desc] of Object.entries(descriptors)) {
    if ('value' in desc) desc.value = deepClone(desc.value, seen);
    Object.defineProperty(dest, k, desc);
  }
  const symbols = Object.getOwnPropertySymbols(src);
  for (const s of symbols) {
    const desc = Object.getOwnPropertyDescriptor(src, s);
    if (desc) {
      if ('value' in desc) desc.value = deepClone(desc.value, seen);
      Object.defineProperty(dest, s, desc);
    }
  }
}