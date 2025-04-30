# lq-dc-js 库测试指南

本目录包含了测试 lq-dc-js 库的各种方法和示例。您可以根据自己的需求选择合适的测试方式。

## 测试文件说明

本目录包含以下测试文件：

1. **demo.html** - 浏览器测试页面，展示库的主要功能
2. **node-test.js** - Node.js环境测试脚本，用于测试CommonJS版本
3. **esm-test.js** - ESM模块测试脚本，用于测试ESM版本
4. **测试指南.md** - 详细的测试方法说明文档

## 快速开始

### 浏览器测试

最简单的测试方法是在浏览器中打开 `demo.html` 文件：

```bash
# 方法1：直接打开文件（可能受浏览器安全限制）
# 双击 demo.html 文件

# 方法2：使用HTTP服务器（推荐）
npx http-server -o /__tests__/demo.html
```

### Node.js测试

使用Node.js测试CommonJS版本：

```bash
node node-test.js
```

### ESM模块测试

测试ESM版本（需要支持ESM的环境）：

```bash
# 使用Node.js的实验性ESM支持
node --experimental-modules esm-test.js

# 或在支持ESM的打包工具中使用
```

## 测试内容

所有测试文件都包含以下功能模块的测试：

- **数组工具** - safeGet, unique, ensureArray 等
- **字符串工具** - ensureString, safeSubstring, isEmpty, format 等
- **日期工具** - format, daysBetween, isInRange 等
- **平台检测** - getEnvType, isBrowser, isNode, isMiniProgram 等
- **数字工具** - ensureNumber, clamp, round, format 等
- **对象工具** - safeGet, safeMerge, deepClone 等

## 自定义测试

您可以根据需要修改这些测试文件，或者创建新的测试文件来测试特定功能。

## 注意事项

- 确保已经构建了库文件（dist目录下的文件）
- 如果测试失败，请先运行 `npm run build` 重新构建库文件
- 浏览器测试时，推荐使用HTTP服务器而不是直接打开文件，以避免跨域问题
- ESM模块测试需要在支持ESM的环境中运行

## 更多信息

详细的测试方法和常见问题解决方案，请参考 [测试指南.md](./测试指南.md) 文件。