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
 * 获取两个日期之间的数差
 * @param {Date|string|number} date1 - 第一个日期
 * @param {Date|string|number} date2 - 第二个日期
 * @param {string} [unit='day'] - 时间单位，可选值：'day'（天）、'month'（月）、'year'（年）
 * @returns {number} 两个日期之间的差值
 */
export function daysBetween(date1, date2, unit = 'day') {
  const safeA = ensureDate(date1);
  const safeB = ensureDate(date2);
  
  // 常量定义
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const yearA = safeA.getFullYear();
  const monthA = safeA.getMonth();
  const dateA = safeA.getDate();
  const yearB = safeB.getFullYear();
  const monthB = safeB.getMonth();
  const dateB = safeB.getDate();
  
  switch (unit) {
    case 'day':
      const utcA = Date.UTC(yearA, monthA, dateA);
      const utcB = Date.UTC(yearB, monthB, dateB);
      return Math.floor((utcB - utcA) / MS_PER_DAY);
      
    case 'month':
      const yearDiff = yearB - yearA;
      const monthDiff = monthB - monthA;
      let totalMonths = yearDiff * 12 + monthDiff;
      
      // 更精确的月份差计算
      if (dateB < dateA) {
        totalMonths--;
      }
      return totalMonths;
      
    case 'year':
      let years = yearB - yearA;
      if (monthB < monthA || (monthB === monthA && dateB < dateA)) {
        years--;
      }
      return years;
      
    default:
      throw new Error('Unsupported unit. Use "day", "month", or "year".');
  }
}

/**
 * 计算两个日期之间的完整差值（年、月、日）
 * @param {Date|string|number} startDate - 开始日期
 * @param {Date|string|number} endDate - 结束日期
 * @returns {Object} 包含年、月、日差值的对象
 * @example
 * dateDiff('2020-03-15', '2023-02-10') 
 * // 返回: { years: 2, months: 10, days: 26 }
 */
export function dateDiff(startDate, endDate) {
  const start = ensureDate(startDate);
  const end = ensureDate(endDate);
  
  // 确保开始日期早于结束日期
  if (start > end) {
    const temp = start;
    start = end;
    end = temp;
  }
  
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();
  
  // 处理天数为负的情况
  if (days < 0) {
    // 获取上个月的最后一天
    const lastDayOfPrevMonth = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += lastDayOfPrevMonth;
    months--;
  }
  
  // 处理月份为负的情况
  if (months < 0) {
    months += 12;
    years--;
  }
  
  return {
    years: years,
    months: months,
    days: days,
    totalMonths: years * 12 + months,
    totalDays: Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  };
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