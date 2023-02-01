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
const utils_1 = require("@/common/utils/utils");
const Config_1 = __importDefault(require("@/config/Config"));
const verifyToken_1 = require("@/middlewares/verifyToken");
const mysql_1 = require("@/server/mysql");
const result_1 = require("@/common/utils/result");
const HttpException_1 = require("@/core/HttpException");
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/user`,
});
router.post('/list', verifyToken_1.verifyTokenPermission, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { 
    // params,
    pageNum, pageSize, } = ctx.request.body;
    // roleId 字段，角色，与权限相关
    const res = (yield (0, mysql_1.command)(`
    (
      SELECT
        u.id,
        u.info,
        u.updated_at,
        r.id roleId,
        r.name roleName
      FROM
        system_user as u,
        system_role as r
      WHERE
        u.deleted = 0
      AND
        FIND_IN_SET(r.id , u.role_ids)
        LIMIT ${pageNum - 1}, ${pageSize}
      )
      ORDER BY
        updated_at DESC;
      SELECT FOUND_ROWS() as total;
  `)).results;
    const total = res[1][0].total;
    const list = [];
    for (const key in res[0]) {
        list.push(res[0][key]);
    }
    const data = (0, result_1.getPagination)(list.map((item) => {
        item.info = JSON.parse(item.info);
        return (0, utils_1.lineToHumpObject)(item);
    }), total, pageSize, pageNum);
    throw new HttpException_1.Success(data);
}));
exports.default = router;
