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
const Config_1 = __importDefault(require("@/config/Config"));
const koa_router_1 = __importDefault(require("koa-router"));
const HttpException_1 = require("@/core/HttpException");
const utils_1 = require("@/common/utils/utils");
const verifyToken_1 = require("@/middlewares/verifyToken");
const mysql_1 = require("@/server/mysql");
const result_1 = require("@/common/utils/result");
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/role`,
});
router.post('/list', verifyToken_1.verifyTokenPermission, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { params, pageNum, pageSize } = ctx.request
        .body;
    const { name = '' } = params;
    const res = (yield (0, mysql_1.command)(`
      (SELECT
        id,
        name,
        \`describe\`,
        updated_at,
        parent_id,
        serial_num,
        menu_ids
      FROM
      system_role
      where
        system_role.name like '%${name}%'
      )
      ORDER BY
      updated_at DESC;

  `)).results.map(utils_1.lineToHumpObject);
    const records = (0, utils_1.getTreeByList)(res, 0);
    const total = records.length;
    if (pageNum > 1) {
        records.splice((pageNum - 1) * pageSize, pageSize);
    }
    const each = (arr) => {
        (0, utils_1.sort)(arr, 'serialNum', 'desc');
        arr.forEach((item) => {
            if (item.children) {
                each(item.children);
            }
        });
    };
    each(records);
    const data = (0, result_1.getPagination)(records, total, pageSize, pageNum);
    throw new HttpException_1.Success(data);
}));
exports.default = router;
