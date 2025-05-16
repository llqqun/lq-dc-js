export const message = {
  success: (msg) => {
      uni.showToast({
          title: msg || '操作成功',
          icon: 'success',
          duration: 1500
      })
  },
  warning: (err) => {
      uni.showToast({
          title: err || '操作失败',
          icon: 'error',
          duration: 1500
      })
  },
  none: (err) => {
      uni.showToast({
          title: err || '',
          icon: 'none',
          duration: 1500
      })
  },
  loading: (title = '加载中...') => {
      uni.showLoading({
          title,
          mask: true
      })
  },
  hide: () => {
      uni.hideLoading();
  },
  modelBox: (content = '' , callback, options = {}) => {
      const defaultOp = {
          title: '温馨提示',
          content,
          showCancel: true,
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
              if (res.confirm) {
                  callback && callback(true);
              } else if (res.cancel) {
                  callback && callback(false);
              }
          }
      }
      const obj = Object.assign(defaultOp, options)
      uni.showModal(obj)
  }
}

function routerFun(options) {
    if (typeof options === 'string') {
      options = { url: options };
    }
    const { url, type = 'navigate', params } = options;
    if (!url && type !== 'back') return;
  
    const urlWithParams = params
      ? `${url}?${Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&')}`
      : url;
    // console.log('routerPush', urlWithParams)
    switch (type) {
      case 'navigate':
        uni.navigateTo({ url: urlWithParams });
        break;
      case 'tab':
        uni.switchTab({ url: urlWithParams });
        break;
      case 'redirect':
        uni.redirectTo({ url: urlWithParams });
        break;
      case 'back':
        if (getCurrentPages().length > 1) {
            uni.navigateBack({ delta: params?.delta || 1 });
        } else {
            routerFun({ url: router.routerHome, type: 'tab' });
        }
        break;
    }
}

export const router = {
    routerHome: '',
    setConfig(str = '') {
        this.routerHome = str
    },
    routerFun
}