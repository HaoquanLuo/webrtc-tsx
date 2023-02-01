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
const koa_router_1 = __importDefault(require("koa-router"));
const svg_captcha_1 = __importDefault(require("svg-captcha"));
const HttpException_1 = require("@/core/HttpException");
const Config_1 = __importDefault(require("@/config/Config"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/common`,
});
/*
 * 获取验证码
 * @returns { image } 返回图片
 */
router.get('/code', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const captcha = svg_captcha_1.default.createMathExpr({
        size: 6,
        fontSize: 45,
        ignoreChars: '0o1i',
        noise: 1,
        width: 100,
        // height:40,//高度
        color: true,
        background: '#cc9966', //背景大小
    });
    ctx.session.code = captcha.text; //把验证码赋值给session
    throw new HttpException_1.Buffer(captcha.data, 'image/svg+xml', captcha.text);
}));
exports.default = router;
