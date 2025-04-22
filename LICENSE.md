# lq-dc-js 授权系统说明

## 概述

为了保护知识产权并控制库的使用权限，lq-dc-js 现已添加授权验证机制。未经授权的用户将无法使用库的功能。

## 授权机制

### 工作原理

1. **授权验证**：库在初始化时会检查是否存在有效的授权密钥
2. **功能限制**：未授权状态下，调用任何功能方法都会抛出错误
3. **授权持久化**：授权信息会保存在本地存储中，无需每次都重新授权
4. **过期机制**：授权密钥有效期默认为30天，过期后需要重新授权

### 获取授权

请联系库的开发者获取有效的授权密钥。授权密钥格式为以 `lq-` 开头的字符串，例如：

```
lq-abcdefghijklmnopqrstuvwxyz123456
```

## 使用方法

### 设置授权密钥

```javascript
import { license } from 'lq-dc-js';

// 设置授权密钥
license.setLicenseKey('lq-your-license-key-here');

// 检查授权状态
const isAuthorized = license.isAuthorized();
console.log('授权状态:', isAuthorized ? '已授权' : '未授权');
```

### 获取授权信息

```javascript
const licenseInfo = license.getLicenseInfo();
console.log('授权信息:', {
  已授权: licenseInfo.isAuthorized,
  过期时间: licenseInfo.expirationDate
});
```

### 自定义授权配置

```javascript
license.configureLicense({
  // 是否启用授权检查
  enabled: true,
  // 授权密钥存储的键名
  storageKey: 'custom-license-key',
  // 授权过期时间（毫秒）
  expirationTime: 7 * 24 * 60 * 60 * 1000, // 7天
  // 是否在控制台显示授权信息
  showConsoleInfo: true
});
```

### 清除授权

```javascript
license.clearLicense();
```

## 开发环境配置

在开发过程中，可以临时禁用授权检查：

```javascript
// 开发环境禁用授权检查
if (process.env.NODE_ENV === 'development') {
  license.configureLicense({
    enabled: false
  });
}
```

## 最佳实践

1. **安全存储密钥**：不要将授权密钥硬编码在公开的代码中，建议使用环境变量或配置文件
2. **尽早授权**：在应用初始化时尽早设置授权密钥
3. **错误处理**：添加适当的错误处理，捕获未授权异常
4. **密钥更新**：实现密钥定期更新的机制，提高安全性

## 技术支持

如有任何关于授权的问题，请联系库的开发者获取支持。