const data = {
  env: getEnv(),
}

// 全局环境信息模块
// 自动检测当前运行环境，供全局使用
function getEnv(userAgent = undefined) {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let platform = 'unknown';
  let isMobile = false;
  let isMiniProgram = false;
  let miniProgramType = '';

  if (userAgent) {
    ua = userAgent;
  }

  // 判断是否为移动端
  if (/Android|webOS|iPhone|iPod|BlackBerry|iPad|Windows Phone/i.test(ua)) {
    isMobile = true;
    platform = 'mobile';
  } else {
    platform = 'pc';
  }

  // 判断是否为H5页面
  let isH5 = typeof window !== 'undefined' && typeof document !== 'undefined';

  // 判断小程序环境（需结合各平台API）
  if (typeof wx !== 'undefined' && wx.getSystemInfo) {
    isMiniProgram = true;
    miniProgramType = 'weixin';
  } else if (typeof swan !== 'undefined' && swan.getSystemInfo) {
    isMiniProgram = true;
    miniProgramType = 'baidu';
  } else if (typeof tt !== 'undefined' && tt.getSystemInfo) {
    isMiniProgram = true;
    miniProgramType = 'douyin';
  } else if (ua.indexOf('AlipayClient') > -1) {
    isMiniProgram = true;
    miniProgramType = 'alipay';
  }

  return {
    platform, // 'pc' | 'mobile'
    isMobile,
    isH5,
    isMiniProgram,
    miniProgramType // '' | 'weixin' | 'baidu' | 'douyin' | 'alipay'
  };
}


export default function getGoogleData() {
  return data;
}