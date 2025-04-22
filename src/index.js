/**
 * lq-dc-js - 多平台通用的JavaScript工具库
 * 防御性编程理念的工具集合
 */

// 导入各个模块
import * as array from './modules/array';
import * as object from './modules/object';
import * as string from './modules/string';
import * as number from './modules/number';
import * as date from './modules/date';
import * as fun from './modules/function';
import * as validator from './modules/validator';
import * as platform from './modules/platform';

// 导出所有模块
export {
  array,
  object,
  string,
  number,
  date,
  fun,
  validator,
  platform
};

// 默认导出
export default {
  array,
  object,
  string,
  number,
  date,
  fun,
  validator,
  platform
};