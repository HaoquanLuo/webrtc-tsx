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
const mysql_1 = require("@/server/mysql");
const HttpException_1 = require("@/core/HttpException");
const Config_1 = __importDefault(require("@/config/Config"));
const validator_1 = __importDefault(require("@/middlewares/validator"));
const login_1 = __importDefault(require("@/common/apiJsonSchema/system/auth/login"));
const verificationCodeValidator_1 = __importDefault(require("@/middlewares/verificationCodeValidator"));
const auth_1 = require("@/server/auth");
const token_1 = require("@/server/auth/token");
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/auth`,
});
router.post('/login', (0, validator_1.default)(login_1.default, 'body'), verificationCodeValidator_1.default, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, userName } = ctx.request.body;
    const res = yield (0, mysql_1.command)(`
        SELECT
        id,email,deleted,info,role_ids,password
        FROM
            system_user
        where
            user_name = '${userName}'
    `);
    if (res.results.length > 0) {
        const user = res.results[0];
        const token = getToken(user, password);
        (0, token_1.saveToken)(token, user.id);
        throw new HttpException_1.Success(token);
    }
    else {
        throw new HttpException_1.QueryFailed('该用户名不存在');
    }
}));
exports.default = router;
/**
 * 获取token
 * @param user
 * @param password
 * @returns
 */
function getToken(user, password) {
    if (user.password !== password) {
        throw new HttpException_1.ParameterException('密码不正确');
    }
    return (0, auth_1.generateToken)(user.id, user.roleIds);
}
