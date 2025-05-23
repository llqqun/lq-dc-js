/**
 * 休眠函数
 * @param {*} ms 
 * @returns 
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}