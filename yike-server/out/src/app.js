"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const http_1 = require("http");
const Init_1 = __importDefault(require("./core/Init"));
const Config_1 = __importDefault(require("./config/Config"));
// 创建 koa 实例
const app = new koa_1.default();
// 创建服务器
const httpServer = (0, http_1.createServer)(app.callback());
// 执行初始化
(0, Init_1.default)(app, httpServer);
// 监听端口
httpServer.listen(Config_1.default.HTTP_PORT, () => {
    console.log(`ENV: ${process.env.NODE_ENV}, PORT: ${Config_1.default.HTTP_PORT}.`);
});
