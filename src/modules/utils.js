/**
 * 休眠函数
 * @param {number} ms - 休眠的毫秒数
 * @returns {Promise<void>} 返回一个在指定时间后解析的Promise
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 复制文本到剪贴板
 * @param {string || document} text - 要复制的文本
 * @returns {Promise<void>} 返回一个在复制完成后解析的Promise
 */
export async function copyText(text) {
  // 检查输入有效性
  if (typeof text !== 'string' || text.trim() === '') {
    console.warn('复制失败：请提供有效的文本内容');
    return false;
  }

  try {
    // 现代浏览器：使用 Clipboard API（更安全，无需创建 DOM 元素）
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text);
      
      return Promise.resolve(text);
    }

    // 降级方案：创建临时 textarea 元素实现复制
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // 避免滚动影响
    textarea.style.opacity = '0'; // 隐藏元素
    document.body.appendChild(textarea);

    // 选中并复制内容
    textarea.select();
    textarea.setSelectionRange(0, text.length); // 适配移动设备
    const success = document.execCommand('copy');

    // 清理临时元素
    document.body.removeChild(textarea);

    return Promise.resolve(text);

  } catch (error) {
    console.error('复制文本时发生错误：', error);
    return Promise.reject(error);
  }
}