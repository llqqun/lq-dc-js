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

export function isSafeNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value)
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

/**
 * 使用crypto.getRandomValues生成加密安全的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} 随机整数
 */
export function random(min, max) {
  // 确保输入有效
  const safeMin = Math.floor(ensureNumber(min));
  const safeMax = Math.floor(ensureNumber(max));
  
  // 确保min <= max
  if (safeMin > safeMax) {
    [safeMin, safeMax] = [safeMax, safeMin];
  }
  
  // 计算范围
  const range = safeMax - safeMin + 1;
  
  // 计算需要的随机位数
  const bitsNeeded = Math.ceil(Math.log2(range));
  const bytesNeeded = Math.ceil(bitsNeeded / 8);
  const mask = Math.pow(2, bitsNeeded) - 1;
  
  // 生成随机数直到落在所需范围内
  const array = new Uint8Array(bytesNeeded);
  while (true) {
    crypto.getRandomValues(array);
    
    let randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) | array[i];
    }
    
    // 应用掩码并检查是否在范围内
    randomValue = randomValue & mask;
    if (randomValue < range) {
      return safeMin + randomValue;
    }
  }
}

/**
 * 使用crypto.getRandomValues生成加密安全的随机浮点数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（不包含）
 * @param {number} [precision=2] - 小数位数
 * @returns {number} 随机浮点数
 */
export function randomFloat(min, max, precision = 2) {
  const safeMin = ensureNumber(min);
  const safeMax = ensureNumber(max);
  const safePrecision = Math.max(0, Math.floor(ensureNumber(precision)));
  
  // 确保min <= max
  if (safeMin > safeMax) {
    [safeMin, safeMax] = [safeMax, safeMin];
  }
  
  // 生成[0, 1)范围内的随机浮点数
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const randomUnit = array[0] / (0xFFFFFFFF + 1);
  
  // 映射到[min, max)范围并四舍五入
  const randomValue = safeMin + randomUnit * (safeMax - safeMin);
  return round(randomValue, safePrecision);
}

/**
 * 判断数字是否在指定范围内
 * @param {number} num - 要判断的数字
 * @param {number} min - 最小值
 * @param {number} max - 最大值（不包含）
 * @param {boolean} [includeMax=false] - 是否包含最大值
 * @returns {boolean} 是否在范围内
 */
export function isInRange(num, min, max, includeMax = false) {
  const safeNum = ensureNumber(num);
  let safeMin = ensureNumber(min);
  let safeMax = ensureNumber(max);
  // 如果max不存在, 则max为min, 最小值为0
  if (safeMax === undefined) {
    safeMax = safeMin;
    safeMin = 0;
  }

  // 确保min <= max
  if (safeMin > safeMax) {
    [safeMin, safeMax] = [safeMax, safeMin];
  }
  if (includeMax) {
    return safeNum >= safeMin && safeNum <= safeMax;
  }

  return safeNum >= safeMin && safeNum < safeMax;
}
