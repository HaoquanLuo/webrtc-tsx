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
const ajv_1 = require("../server/ajv");
/**
 * @description 数据校验中间件
 * @param schema
 * @param type
 * @returns
 */
function validator(schema, type = 'query') {
    return function validator(ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = ctx.request[type];
            const errors = (0, ajv_1.validate)(schema, data) || null;
            if (errors) {
                console.log('数据校验失败');
                //校验失败
                throw new HttpException_1.ParameterException(errors);
            }
            yield next();
        });
    };
}
exports.default = validator;
