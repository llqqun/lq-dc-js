// 日期模块类型定义
export interface DateModule {
  ensureDate(value: Date | string | number, defaultValue?: Date): Date;
  format(date: Date | string | number, format?: string): string;
  daysBetween(dateA: Date | string | number, dateB: Date | string | number, unit?: 'day' | 'month' | 'year'): number;
  isInRange(date: Date | string | number, startDate: Date | string | number, endDate: Date | string | number): boolean;
  dateDiff(startDate: Date | string | number, endDate: Date | string | number): {
    years: number;
    months: number;
    days: number;
    totalMonths: number;
    totalDays: number;
  };
}

// 数组模块类型定义
export interface ArrayModule {
  chunk<T>(array: T[], size: number): T[][];
  unique<T>(array: T[]): T[];
  flatten<T>(array: (T | T[])[]): T[];
  groupBy<T>(array: T[], key: string | ((item: T) => string)): Record<string, T[]>;
  shuffle<T>(array: T[]): T[];
  [key: string]: (...args: any[]) => any;
}

// 字符串模块类型定义
export interface StringModule {
  capitalize(str: string): string;
  truncate(str: string, length: number, suffix?: string): string;
  camelCase(str: string): string;
  kebabCase(str: string): string;
  [key: string]: (...args: any[]) => any;
}

// 数字模块类型定义
export interface NumberModule {
  clamp(num: number, min: number, max: number): number;
  round(num: number, precision?: number): number;
  random(min: number, max: number): number;
  format(num: number, options?: Intl.NumberFormatOptions): string;
  [key: string]: (...args: any[]) => any;
}

// 对象模块类型定义
export interface ObjectModule {
  pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
  omit<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
  deepClone<T>(obj: T): T;
  isEqual(obj1: any, obj2: any): boolean;
  [key: string]: (...args: any[]) => any;
}

// 验证器模块类型定义
export interface ValidatorModule {
  isEmail(str: string): boolean;
  isPhone(str: string): boolean;
  isUrl(str: string): boolean;
  isEmpty(value: any): boolean;
  [key: string]: (...args: any[]) => any;
}

// 平台模块类型定义
export interface PlatformModule {
  isMiniProgram(): boolean;
  isWeChat(): boolean;
  isAndroid(): boolean;
  isIOS(): boolean;
  isMobile(): boolean;
  [key: string]: (...args: any[]) => any;
}

// 函数模块类型定义
export interface FunctionModule {
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): T;
  once<T extends (...args: any[]) => any>(func: T): T;
  [key: string]: (...args: any[]) => any;
}

// 微信小程序工具类型定义
export interface WxToolsModule {
  [key: string]: (...args: any[]) => any;
}

// 微信小程序HTTP类型定义
export interface WuHttpModule {
  [key: string]: (...args: any[]) => any;
}

// Google数据类型定义
export interface GoogleData {
  [key: string]: any;
}

// 授权模块类型定义
export interface LicenseModule {
  isAuthorized(): boolean;
  validate(license: string, id: string): boolean;
  generate(options: { id: string; days: number }): string;
  [key: string]: (...args: any[]) => any;
}

// 主模块接口定义
export interface LqDcJs {
  google?: GoogleData;
  arrayUtils: ArrayModule;
  ob: ObjectModule;
  str: StringModule;
  nu: NumberModule;
  date: DateModule;
  fun: FunctionModule;
  vl: ValidatorModule;
  platform: PlatformModule;
  license: LicenseModule;
  utils: Record<string, (...args: any[]) => any>;
  wuh: WuHttpModule;
  wxTools: WxToolsModule;
}

declare const lqDcJs: LqDcJs;
export default lqDcJs;