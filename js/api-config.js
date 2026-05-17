/**
 * API 配置
 * 本地开发时修改 BASE_URL 为本地地址
 * 生产环境注释掉或设为空字符串
 */

// 生产环境配置（服务器部署）
const API_BASE_URL = '';

// 本地开发配置（取消注释使用）
// const API_BASE_URL = 'http://localhost:8081';

// 导出配置
window.API_BASE_URL = API_BASE_URL;
