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
exports.verifyTokenPermission = exports.getToken = void 0;
const Config_1 = __importDefault(require("../config/Config"));
const HttpException_1 = require("../core/HttpException");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("../server/auth/token");
const auth_1 = require("../server/auth");
/**
 * 校验token是否合法
 * @param ctx
 * @param next
 * @param callback
 */
function verifyToken(ctx, next, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        // 获取token
        const userToken = getToken(ctx);
        // 如果token不存在, 或者不存在redis里
        if (!userToken || !(yield (0, token_1.getTokenValue)(userToken)).results) {
            throw new HttpException_1.Forbidden('无访问权限');
        }
        // 尝试解析token, 获取uid和scope
        const { uid, scope } = (yield analyzeToken(userToken));
        // 在上下文保存uid和scope
        ctx.auth = {
            uid,
            scope,
        };
        if (callback) {
            yield callback({ uid, scope });
        }
        yield next();
    });
}
exports.default = verifyToken;
/**
 * 获取token
 * @param ctx
 * @returns
 */
function getToken(ctx) {
    return ctx.header['authorization'] || ctx.cookies.get('authorization') || '';
}
exports.getToken = getToken;
/**
 * 解析token
 * @param token
 * @returns
 */
function analyzeToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, Config_1.default.SECURITY.SECRET_KEY, (error, decode) => {
                if (error) {
                    reject(error);
                }
                resolve(decode);
            });
        }).catch((error) => {
            if (error.name === 'TokenExpiredError') {
                throw new HttpException_1.AuthFailed('token已过期');
            }
            throw new HttpException_1.Forbidden('token不合法');
        });
    });
}
/**
 * 校验token权限
 * @param ctx
 * @param next
 */
function verifyTokenPermission(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield verifyToken(ctx, next, (decode) => __awaiter(this, void 0, void 0, function* () {
            const permissionList = yield (0, auth_1.getRedisUserPermission)(decode);
            const bool = permissionList.find((permission) => {
                const path = `${Config_1.default.API_PREFIX}v1/${permission.split(':').join('/')}`;
                return path === ctx.path;
            });
            if (!bool) {
                throw new HttpException_1.Forbidden('权限不足');
            }
        }));
    });
}
exports.verifyTokenPermission = verifyTokenPermission;
