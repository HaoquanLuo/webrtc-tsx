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
/**
 * @description 校验图形验证码
 * @param ctx
 * @param next
 */
function verificationCodeValidator(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { code } = ctx.request.body;
        console.log(`code: ${code}, ctx: ${JSON.stringify(ctx)}`);
        if (code === 'register') {
            console.log('-------register--------');
            yield next();
        }
        if (ctx.session === null) {
            throw new Error('session 为 null');
        }
        if (ctx.session.code === undefined) {
            throw new Error('session.code 不存在');
        }
        if (ctx.session.code !== code) {
            throw new HttpException_1.ParameterException('验证码错误');
        }
        else {
            yield next();
        }
    });
}
exports.default = verificationCodeValidator;
