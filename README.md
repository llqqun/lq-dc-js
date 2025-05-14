# lq-dc-js

## 简介

`lq-dc-js` 是一个JavaScript工具库，基于防御性编程理念设计，提供了丰富的工具函数，可以在浏览器、Node.js和小程序等多种环境中使用。

防御性编程是一种编程思想，通过预先检查输入、处理边界情况和异常值，提高代码的健壮性和可靠性。本工具库中的所有函数都遵循这一理念，确保在各种情况下都能安全稳定地运行。

## 特性

- 🛡️ **防御性编程**：所有函数都进行了严格的输入检查和边界处理
- 🌐 **多平台支持**：可在浏览器、Node.js和小程序等环境中使用
- 📦 **模块化设计**：按功能分类，可按需引入
- 🔍 **类型友好**：提供完整的类型定义
- 🧩 **零依赖**：不依赖任何第三方库
- 📄 **完整文档**：详细的API文档和使用示例

## 安装

### NPM

```bash
npm install lq-dc-js --save
```

### Yarn

```bash
yarn add lq-dc-js
```

### CDN

```html
<script src="https://unpkg.com/lq-dc-js/dist/index.umd.js"></script>
```

## 使用方法

### ES模块

```javascript
// 引入整个库
import lqDcJs from 'lq-dc-js';

// 按需引入
import { arrayUtils, string } from 'lq-dc-js';

// 引入特定函数
import { safeGet } from 'lq-dc-js/arrayUtils';
```

### CommonJS

```javascript
// 引入整个库
const lqDcJs = require('lq-dc-js');

// 按需引入
const { arrayUtils, string } = require('lq-dc-js');
```

### 浏览器

```html
<script src="path/to/lq-dc-js/dist/index.umd.js"></script>
<script>
  // 通过全局变量 lqDcJs 访问
  const safeValue = lqDcJs.arrayUtils.safeGet(myArray, 0, 'default');
</script>
```

## 示例

### 安全获取数组元素

```javascript
import { arrayUtils } from 'lq-dc-js';

const arr = [1, 2, 3];

// 安全获取数组元素，防止越界访问
const value1 = arrayUtils.safeGet(arr, 1); // 2
const value2 = arrayUtils.safeGet(arr, 5, 'default'); // 'default'
const value3 = arrayUtils.safeGet(null, 0, 'default'); // 'default'
```

### 安全获取对象属性

```javascript
import { object } from 'lq-dc-js';

const user = {
  profile: {
    name: 'John',
    address: {
      city: 'Beijing'
    }
  }
};

// 安全获取对象属性，支持深层路径
const city = object.safeGet(user, 'profile.address.city'); // 'Beijing'
const country = object.safeGet(user, 'profile.address.country', 'Unknown'); // 'Unknown'
```

## API文档

### 模块概览

- **array** - 数组相关工具函数
- **object** - 对象相关工具函数
- **string** - 字符串相关工具函数
- **number** - 数字相关工具函数
- **date** - 日期相关工具函数
- **function** - 函数相关工具函数
- **validator** - 数据验证相关工具函数
- **platform** - 平台检测相关工具函数

详细API文档请查看 [API文档](./docs/api.md)

## 开发

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 测试

```bash
npm test
```

## 许可证

[MIT](./LICENSE)
