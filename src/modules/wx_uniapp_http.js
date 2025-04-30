class API {
  static instance = null;
  constructor() {
    if (API.instance) {
      return API.instance;
    }
    API.instance = this;
    // 基础配置
    this.tokenName = 'token';
    this.loginPath = '/pages/login/index'; // 登录页面路径
    this.baseURL = ''; // 替换为您的实际 API 地址
    this.timeout = 60000; // 超时时间，单位毫秒
    this.header = {
      'content-type': 'application/json'
    };
    
    // 拦截器
    this.interceptors = {
      request: null,
      response: null
    };
  }

  static getInstance() {
    if (!API.instance) {
      API.instance = new API();
    }
    return API.instance;
  }

  // 设置请求拦截器
  setRequestInterceptor(callback) {
    this.interceptors.request = callback;
  }

  // 设置响应拦截器
  setResponseInterceptor(callback) {
    this.interceptors.response = callback;
  }

  // 处理请求配置
  handleConfig(config) {
    // 判断URL是否已经是完整URL（以http或https开头）
    const isFullUrl = config.url && (config.url.startsWith('http://') || config.url.startsWith('https://'));
    
    // 合并默认配置
    const defaultConfig = {
      url: isFullUrl ? config.url : this.baseURL + config.url,
      timeout: this.timeout,
      header: { ...this.header }
    };
    
    // 合并配置
    const mergedConfig = { ...defaultConfig, ...config };
    // 确保url使用的是处理过的defaultConfig.url
    mergedConfig.url = defaultConfig.url;
    
    // 应用请求拦截器
    if (this.interceptors.request && typeof this.interceptors.request === 'function') {
      return this.interceptors.request(mergedConfig);
    }
    
    return mergedConfig;
  }

  // 处理响应
  handleResponse(response, resolve, reject) {
    // 应用响应拦截器
    if (this.interceptors.response && typeof this.interceptors.response === 'function') {
      const result = this.interceptors.response(response);
      if (result) {
        resolve(result);
      } else {
        reject(response);
      }
      return;
    }
    
    // 默认响应处理
    if (response.statusCode >= 200 && response.statusCode < 300) {
      resolve(response.data);
    } else {
      reject(response);
    }
  }

  // 发送请求
  request(config) {
    const finalConfig = this.handleConfig(config);
    
    return new Promise((resolve, reject) => {
      finalConfig.success = (response) => {
        this.handleResponse(response, resolve, reject);
      };
      
      finalConfig.fail = (error) => {
        reject(error);
      };
      uni.request(finalConfig);
    });
  }

  // GET 请求
  get(url, params = {}, header = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      header
    });
  }

  // POST 请求
  post(url, data = {}, header = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      header
    });
  }

  // PUT 请求
  put(url, data = {}, header = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      header
    });
  }

  // DELETE 请求
  delete(url, data = {}, header = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      header
    });
  }

  // 上传文件
  upload(url, filePath, name = 'file', formData = {}, header = {}) {
    const finalUrl = this.baseURL + url;
    
    return new Promise((resolve, reject) => {
      uni.uploadFile({
        url: finalUrl,
        filePath,
        name,
        formData,
        header: { ...this.header, ...header },
        success: (response) => {
          // 上传文件接口返回的是字符串，需要转换为对象
          if (typeof response.data === 'string') {
            try {
              response.data = JSON.parse(response.data);
            } catch (e) {
              // 解析失败，保持原样
            }
          }
          this.handleResponse(response, resolve, reject);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  // 下载文件
  download(url, params = {}, header = {}) {
    const finalUrl = this.baseURL + url;
    
    return new Promise((resolve, reject) => {
      uni.downloadFile({
        url: finalUrl,
        data: params,
        header: { ...this.header, ...header },
        success: (response) => {
          this.handleResponse(response, resolve, reject);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
}

// 创建实例
const api = new API();

// 设置请求拦截器
api.setRequestInterceptor((config) => {
  // 从store中获取token
  const token = uni.getStorageSync(api.tokenName);
  if (token) {
    config.header[api.tokenName] = `${token}`;
  }
  return config;
});

// 示例：设置响应拦截器
api.setResponseInterceptor((response) => {
  // 例如：统一处理响应
  if (response.statusCode === 200 && response.data.code === 401) {
    // token 过期，跳转到登录页
    uni.removeStorageSync(api.tokenName);
    uni.showModal({
      title: '提示',
      content: '登录已失效，请重新登录',
      showCancel: true,
      confirmText: '去登录',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: api.loginPath
          });
        }
      }
    })
    return null;
  }
  
  // 自定义业务状态码处理
  if (response.data && response.data.code !== 200) {
    uni.showToast({
      title: response.data.message || '请求失败',
      icon: 'none'
    });
    return null;
  }
  
  return response.data;
});

export default api;