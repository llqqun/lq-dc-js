/**
 * 日期相关工具函数
 */

/**
 * 安全创建日期对象
 * @param {Date|string|number} value - 日期值、时间戳或日期字符串
 * @param {Date} [defaultValue=new Date()] - 当输入无效时返回的默认日期
 * @returns {Date} 日期对象
 */
export function ensureDate(value, defaultValue = new Date()) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? defaultValue : value;
  }
  
  const date = new Date(value);
  return isNaN(date.getTime()) ? defaultValue : date;
}

/**
 * 格式化日期为字符串
 * @param {Date|string|number} date - 要格式化的日期
 * @param {string} [format='YYYY-MM-DD'] - 格式模板
 * @returns {string} 格式化后的日期字符串
 */
export function format(date, format = 'YYYY-MM-DD') {
  const safeDate = ensureDate(date);
  
  const year = safeDate.getFullYear();
  const month = safeDate.getMonth() + 1;
  const day = safeDate.getDate();
  const hours = safeDate.getHours();
  const minutes = safeDate.getMinutes();
  const seconds = safeDate.getSeconds();
  
  // 补零函数
  const pad = (num) => (num < 10 ? `0${num}` : `${num}`);
  
  return format
    .replace('YYYY', year)
    .replace('YY', String(year).slice(2))
    .replace('MM', pad(month))
    .replace('M', month)
    .replace('DD', pad(day))
    .replace('D', day)
    .replace('HH', pad(hours))
    .replace('H', hours)
    .replace('mm', pad(minutes))
    .replace('m', minutes)
    .replace('ss', pad(seconds))
    .replace('s', seconds);
}

/**
 * 获取两个日期之间的天数差
 * @param {Date|string|number} dateA - 第一个日期
 * @param {Date|string|number} dateB - 第二个日期
 * @returns {number} 天数差
 */
export function daysBetween(dateA, dateB) {
  const safeA = ensureDate(dateA);
  const safeB = ensureDate(dateB);
  
  // 转换为UTC日期，忽略时区差异
  const utcA = Date.UTC(safeA.getFullYear(), safeA.getMonth(), safeA.getDate());
  const utcB = Date.UTC(safeB.getFullYear(), safeB.getMonth(), safeB.getDate());
  
  // 计算天数差
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((utcB - utcA) / millisecondsPerDay);
}

/**
 * 检查日期是否在指定范围内
 * @param {Date|string|number} date - 要检查的日期
 * @param {Date|string|number} startDate - 开始日期
 * @param {Date|string|number} endDate - 结束日期
 * @returns {boolean} 是否在范围内
 */
export function isInRange(date, startDate, endDate) {
  const safeDate = ensureDate(date).getTime();
  const safeStart = ensureDate(startDate).getTime();
  const safeEnd = ensureDate(endDate).getTime();
  
  return safeDate >= safeStart && safeDate <= safeEnd;
}