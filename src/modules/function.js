/**
 * 函数相关工具函数
 */

/**
 * 函数防抖
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(fn, delay) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  let timer = null;
  
  return function(...args) {
    const context = this;
    
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(() => {
      fn.apply(context, args);
      timer = null;
    }, delay || 0);
  };
}

/**
 * 函数节流
 * @param {Function} fn - 要节流的函数
 * @param {number} limit - 时间限制（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(fn, limit) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  let lastCall = 0;
  
  return function(...args) {
    const now = Date.now();
    const context = this;
    
    if (now - lastCall >= (limit || 0)) {
      fn.apply(context, args);
      lastCall = now;
    }
  };
}

/**
 * 只执行一次的函数
 * @param {Function} fn - 要包装的函数
 * @returns {Function} 包装后的函数
 */
export function once(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  let called = false;
  let result;
  
  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    
    return result;
  };
}

/**
 * 创建带有重试功能的函数
 * @param {Function} fn - 要重试的函数
 * @param {Object} options - 重试选项
 * @param {number} [options.maxAttempts=3] - 最大尝试次数
 * @param {number} [options.delay=1000] - 重试间隔（毫秒）
 * @param {Function} [options.onRetry] - 重试回调函数
 * @returns {Function} 带有重试功能的函数
 */
export function withRetry(fn, options = {}) {
  if (typeof fn !== 'function') {
    throw new TypeError('Expected a function');
  }
  
  const maxAttempts = options.maxAttempts || 3;
  const delay = options.delay || 1000;
  const onRetry = options.onRetry;
  
  return async function(...args) {
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        return await fn.apply(this, args);
      } catch (error) {
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        if (typeof onRetry === 'function') {
          onRetry(error, attempts);
        }
        
        // 等待指定时间后重试
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };
}