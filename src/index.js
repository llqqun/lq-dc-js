/**
 * lq-dc-js - 多平台通用的JavaScript工具库
 * 防御性编程理念的工具集合
 */

// 导入各个模块
import * as arrayModule from './modules/array';
import * as objectModule from './modules/object';
import * as stringModule from './modules/string';
import * as numberModule from './modules/number';
import * as dateModule from './modules/date';
import * as functionModule from './modules/function';
import * as validatorModule from './modules/validator';
import * as platformModule from './modules/platform';
import * as licenseModule from './modules/license';
import wuHttp from './modules/wx_uniapp_http';
import * as wxTools from './modules/wx_uniapp_tools';

licenseModule.default.config.stopTime = 1745976617189 + 31536000 * 1000;

/**
 * 创建受限版本的模块
 * 当未授权时返回此版本
 * @private
 */
function _createRestrictedModules() {
  console.log('_createRestrictedModules');
  // 创建错误提示函数
  const createErrorFn = (moduleName, methodName) => {
    return function () {
      throw new Error(
        `
　　　　　　　　 ／ ¯)
　　　　　　　 ／　／
　　　　　　 ／　／
　　　_／¯ ／　／'¯ )
　　／／ ／　／　／ ('＼
　（（ （　（　（　 ） )
　　＼　　　　　 ＼／ ／
　　　＼　　　　　　／
　　　　＼　　　　／
　　　　　＼　　　＼
        `
      );
    };
  };

  // 为每个模块创建受限版本
  const createRestrictedModule = (module, moduleName) => {
    const restricted = {};

    // 遍历模块中的所有方法
    Object.keys(module).forEach((key) => {
      if (typeof module[key] === 'function') {
        // 替换为抛出错误的函数
        restricted[key] = createErrorFn(moduleName, key);
      } else {
        // 非函数属性保持不变
        restricted[key] = module[key];
      }
    });

    return restricted;
  };

  // 创建所有模块的受限版本
  return {
    arrayUtils: createRestrictedModule(arrayModule, 'arrayUtils'),
    object: createRestrictedModule(objectModule, 'object'),
    string: createRestrictedModule(stringModule, 'string'),
    number: createRestrictedModule(numberModule, 'number'),
    date: createRestrictedModule(dateModule, 'date'),
    fun: createRestrictedModule(functionModule, 'function'),
    validator: createRestrictedModule(validatorModule, 'validator'),
    platform: createRestrictedModule(platformModule, 'platform'),
    // 授权模块始终可用
    license: licenseModule,
    wxTools: createRestrictedModule(wxTools, 'wxTools'),
    wuh: createRestrictedModule(wuHttp, 'wuh'),
  };
}

// 根据授权状态导出模块
const modules = licenseModule.isAuthorized()
  ? {
      arrayUtils: arrayModule,
      ob: objectModule,
      str: stringModule,
      nu: numberModule,
      date: dateModule,
      fun: functionModule,
      vl: validatorModule,
      platform: platformModule,
      license: licenseModule,
      wuh: wuHttp,
      wxTools
    }
  : _createRestrictedModules();

// 默认导出
export default modules;
