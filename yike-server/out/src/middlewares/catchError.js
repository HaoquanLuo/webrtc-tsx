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
Object.defineProperty(exports, "__esModule", { value: true });
const HttpException_1 = require("../core/HttpException");
const logs_1 = require("../server/logs");
function catchError(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield next();
        }
        catch (error) {
            // 当前错误是否是我们自定义的Http错误
            const isHttpException = error instanceof HttpException_1.HttpException;
            // 如果不是, 则抛出错误
            if (!isHttpException) {
                (0, logs_1.errorLog)(ctx, error);
                const { method, path } = ctx;
                ctx.body = {
                    msg: '未知错误',
                    errorCode: 9999,
                    requestUrl: `${method} ${path}`,
                };
                ctx.status = 500;
            }
            // 如果是已知错误
            else {
                // 根据给error设置的相应类型设置相应数据类型
                if (error.responseType) {
                    ctx.response.type = error.responseType;
                }
                // 如果是文件流，则直接返回文件
                if (error.isBuffer) {
                    ctx.body = error.data;
                }
                else {
                    ctx.body = {
                        msg: error.message,
                        errorCode: error.errorCode,
                        data: error.data,
                    };
                }
                ctx.status = error.code;
                if (error instanceof HttpException_1.Success || error instanceof HttpException_1.Buffer) {
                    (0, logs_1.infoLog)(ctx);
                }
                else {
                    (0, logs_1.errorLog)(ctx, error);
                }
            }
        }
    });
}
exports.default = catchError;
