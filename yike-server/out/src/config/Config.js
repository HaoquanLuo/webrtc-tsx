"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RedisDbName_1 = __importDefault(require("./RedisDbName"));
const isDev = process.env.NODE_ENV === 'development';
class Config {
}
exports.default = Config;
// 是否是测试环境
Config.IS_DEV = isDev;
// 服务器端口
Config.HTTP_PORT = 9000;
// 接口前缀
Config.API_PREFIX = '/api/';
// 根目录
Config.BASE = isDev ? 'src' : 'out/src';
// redis数据库
Config.REDIS_DB_NAME = RedisDbName_1.default;
// mysql配置
Config.MYSQL = {
    DB_NAME: 'yike',
    HOST: '127.0.0.1',
    PORT: 3306,
    USER_NAME: 'root',
    PASSWORD: '123456',
    CONNECTION_LIMIT: 60 * 60 * 1000,
    CONNECT_TIMEOUT: 60 * 60 * 1000,
    ACQUIRE_TIMEOUT: 60 * 60 * 1000,
    TIMEOUT: 60 * 60 * 1000,
};
// redis
Config.REDIS = {
    PORT: 6379,
    HOST: '127.0.0.1',
    // PASSWORD: 'admin',
    DB: 0,
};
// 默认时间格式
Config.DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
// 安全配置
Config.SECURITY = {
    // token key
    SECRET_KEY: 'learn-koa-ts',
    // 过期时间
    EXPIRES_IN: 60 * 60 * 24 * 0.5,
    // 存储token的redis数据库名
    TOKEN_REDIS_DB: Config.REDIS_DB_NAME.TOKEN,
};
