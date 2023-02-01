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
const date_1 = require("@/common/utils/date");
const Config_1 = __importDefault(require("@/config/Config"));
const validator_1 = __importDefault(require("@/middlewares/validator"));
const register_1 = __importDefault(require("@/common/apiJsonSchema/system/auth/register"));
const verificationCodeValidator_1 = __importDefault(require("@/middlewares/verificationCodeValidator"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/auth`,
});
router.post('/register', (0, validator_1.default)(register_1.default, 'body'), verificationCodeValidator_1.default, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, userName, email } = ctx.request.body;
    const date = (0, date_1.format)(new Date());
    // 注册
    yield (0, mysql_1.command)(`
        INSERT INTO system_user ( user_name, email, password, role_ids, created_at, updated_at )
        VALUES
        ( '${userName}', '${email}', '${password}', '', '${date}', '${date}' );
    `);
    throw new HttpException_1.Success();
}));
exports.default = router;
