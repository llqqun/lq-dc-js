/**
 * 数组工具函数测试
 */

import { safeGet, unique, ensureArray } from '../src/modules/array';

describe('array 模块测试', () => {
  describe('safeGet 函数', () => {
    test('应该正确获取有效索引的数组元素', () => {
      const arr = [1, 2, 3, 4, 5];
      expect(safeGet(arr, 0)).toBe(1);
      expect(safeGet(arr, 2)).toBe(3);
      expect(safeGet(arr, 4)).toBe(5);
    });

    test('当索引无效时应该返回默认值', () => {
      const arr = [1, 2, 3];
      expect(safeGet(arr, -1)).toBeNull();
      expect(safeGet(arr, 5)).toBeNull();
      expect(safeGet(arr, 10, 'default')).toBe('default');
    });

    test('当输入不是数组时应该返回默认值', () => {
      expect(safeGet(null, 0)).toBeNull();
      expect(safeGet(undefined, 0)).toBeNull();
      expect(safeGet('string', 0)).toBeNull();
      expect(safeGet({}, 0)).toBeNull();
      expect(safeGet(123, 0, 'default')).toBe('default');
    });
  });

  describe('unique 函数', () => {
    test('应该移除数组中的重复元素', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
      expect(unique([true, false, true])).toEqual([true, false]);
    });

    test('当输入不是数组时应该返回空数组', () => {
      expect(unique(null)).toEqual([]);
      expect(unique(undefined)).toEqual([]);
      expect(unique('string')).toEqual([]);
      expect(unique(123)).toEqual([]);
      expect(unique({})).toEqual([]);
    });
  });

  describe('ensureArray 函数', () => {
    test('应该保持数组不变', () => {
      const arr = [1, 2, 3];
      expect(ensureArray(arr)).toBe(arr);
      expect(ensureArray([4, 5, 6])).toEqual([4, 5, 6]);
    });

    test('应该将非数组值包装为数组', () => {
      expect(ensureArray('string')).toEqual(['string']);
      expect(ensureArray(123)).toEqual([123]);
      expect(ensureArray(true)).toEqual([true]);
      expect(ensureArray({ key: 'value' })).toEqual([{ key: 'value' }]);
    });

    test('应该将 null 和 undefined 转换为空数组', () => {
      expect(ensureArray(null)).toEqual([]);
      expect(ensureArray(undefined)).toEqual([]);
    });
  });
});