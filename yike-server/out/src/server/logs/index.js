"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLog = exports.infoLog = void 0;
const logger_1 = __importDefault(require("./logger"));
/**
 * 记录信息日志
 * @param ctx
 */
function infoLog(ctx) {
    const { method, response, originalUrl } = ctx;
    logger_1.default.info(method, response.status, originalUrl);
}
exports.infoLog = infoLog;
/**
 * 记录错误日志
 * @param ctx
 * @param error
 */
function errorLog(ctx, error) {
    const { method, response, originalUrl } = ctx;
    logger_1.default.error(method, response.status, originalUrl, error);
}
exports.errorLog = errorLog;
