module.exports = {
  // 测试环境
  testEnvironment: 'node',
  
  // 测试文件匹配模式
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // 测试覆盖率收集
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js'],
  
  // 忽略的文件
  testPathIgnorePatterns: ['/node_modules/'],
  
  // 转换器
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // 模块解析
  moduleFileExtensions: ['js', 'json'],
  
  // 测试超时时间
  testTimeout: 10000
};