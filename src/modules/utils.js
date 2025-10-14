/**
 * 休眠函数
 * @param {number} ms - 休眠的毫秒数
 * @returns {Promise<void>} 返回一个在指定时间后解析的Promise
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}