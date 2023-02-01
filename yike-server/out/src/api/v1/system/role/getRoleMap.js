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
const mysql_1 = require("@/server/mysql");
const HttpException_1 = require("@/core/HttpException");
const verifyToken_1 = __importDefault(require("@/middlewares/verifyToken"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/role`,
});
router.get('/getRoleMap', verifyToken_1.default, () => __awaiter(void 0, void 0, void 0, function* () {
    const res = (yield (0, mysql_1.command)(`
      (SELECT
        id,
        name,
        \`describe\`,
        updated_at,
        parent_id,
        serial_num
      FROM
        system_role)
      ORDER BY
      updated_at DESC;

  `)).results.map(utils_1.lineToHumpObject);
    const records = (0, utils_1.getTreeByList)(res, 0);
    const each = (arr) => {
        (0, utils_1.sort)(arr, 'serialNum', 'desc');
        arr.forEach((item) => {
            if (item.children) {
                each(item.children);
            }
        });
    };
    each(records);
    throw new HttpException_1.Success(records);
}));
exports.default = router;
