// 测试formatTree函数

// 导入formatTree函数
const formatTree = (arr, idKey, parentKey, childrenKey, rootValue) => {
  if (!Array.isArray(arr)) {
    return [];
  }

  const result = [];
  const map = {};

  // 构建映射表
  arr.forEach(item => {
    map[item[idKey]] = { ...item };
    // 确保每个节点都有children属性
    if (!map[item[idKey]][childrenKey]) {
      map[item[idKey]][childrenKey] = [];
    }
  });

  // 构建树形结构
  arr.forEach(item => {
    const parentId = item[parentKey];
    // 判断是否为根节点
    const isRoot = rootValue !== undefined 
      ? parentId === rootValue 
      : !map[parentId] || (item[idKey] === parentId);
    
    if (isRoot) {
      // 根节点直接加入结果数组
      result.push(map[item[idKey]]);
    } else {
      // 非根节点，添加到父节点的children中
      if (map[parentId]) {
        map[parentId][childrenKey].push(map[item[idKey]]);
      } else {
        // 找不到父节点时，作为根节点处理
        result.push(map[item[idKey]]);
      }
    }
  });

  return result;
};

// 测试数据
const data = [
  { id: 0, parentId: 0, name: '-A' },
  { id: 1, parentId: 0, name: 'A' },
  { id: 2, parentId: 1, name: 'B' },
  { id: 3, parentId: 1, name: 'C' },
  { id: 4, parentId: 2, name: 'D' },
];

// 测试不同情况
console.log('默认情况:');
console.log(JSON.stringify(formatTree(data, 'id', 'parentId', 'children'), null, 2));

console.log('\n指定rootValue=0:');
console.log(JSON.stringify(formatTree(data, 'id', 'parentId', 'children', 0), null, 2));

// 测试其他情况
const data2 = [
  { id: 1, pid: null, name: 'Root' },
  { id: 2, pid: 1, name: 'Child1' },
  { id: 3, pid: 1, name: 'Child2' },
  { id: 4, pid: 2, name: 'Grandchild' },
];

console.log('\n测试null作为根节点:');
console.log(JSON.stringify(formatTree(data2, 'id', 'pid', 'children'), null, 2));