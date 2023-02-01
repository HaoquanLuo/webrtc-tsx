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
const HttpException_1 = require("@/core/HttpException");
const Config_1 = __importDefault(require("@/config/Config"));
const verifyToken_1 = require("@/middlewares/verifyToken");
const token_1 = require("@/server/auth/token");
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/auth`,
});
/*
 * 退出登录
 */
router.get('/logout', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, token_1.deleteToken)((0, verifyToken_1.getToken)(ctx));
    throw new HttpException_1.Success();
}));
exports.default = router;
