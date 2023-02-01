"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("@koa/cors"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_session_1 = __importDefault(require("koa-session"));
const Config_1 = __importDefault(require("../config/Config"));
const catchError_1 = __importDefault(require("../middlewares/catchError"));
const utils_1 = require("../common/utils/utils");
const auth_1 = require("../server/auth");
const plugin_1 = require("../plugin");
class Init {
    static initCore(app, server) {
        Init.app = app;
        Init.server = server;
        Init.loadBodyParser();
        Init.initCatchError();
        Init.loadSession();
        Init.initLoadRouters();
        Init.loadCors();
        Init.updateRedisRole();
        Init.initPlugin();
    }
    // 加载 cors 模块
    static loadCors() {
        Init.app.use((0, cors_1.default)());
    }
    // 解析body参数
    static loadBodyParser() {
        Init.app.use((0, koa_bodyparser_1.default)());
    }
    // http路由加载
    static initLoadRouters() {
        return __awaiter(this, void 0, void 0, function* () {
            const dirPath = path_1.default.join(`${process.cwd()}/${Config_1.default.BASE}/api/`);
            (0, utils_1.getAllFilesExport)(dirPath, (file) => {
                Init.app.use(file.routes());
            });
        });
    }
    // 错误监听和日志处理
    static initCatchError() {
        Init.app.use(catchError_1.default);
    }
    // 加载session
    static loadSession() {
        Init.app.keys = ['yike server'];
        Init.app.use((0, koa_session_1.default)({
            key: 'koa:sess',
            maxAge: 86400000,
            overwrite: true,
            httpOnly: true,
            signed: true,
            rolling: false,
            renew: false, //(boolean) renew session when session is nearly expired,
        }, Init.app));
    }
    // 更新redis里的角色数据
    static updateRedisRole() {
        (0, auth_1.updateRedisRole)();
    }
    static initPlugin() {
        (0, plugin_1.initPlugin)({
            pluginNames: ['SocketServer'],
            app: Init.app,
            server: Init.server,
        });
    }
}
exports.default = Init.initCore;
