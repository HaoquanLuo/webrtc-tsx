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
exports.selectDb = exports.redisCatch = void 0;
const HttpException_1 = require("../../core/HttpException");
const redis_1 = __importDefault(require("./redis"));
/**
 * redis报错回调
 * @param err
 */
function redisCatch(err) {
    throw new HttpException_1.DataBaseFailed(err.message);
}
exports.redisCatch = redisCatch;
/**
 * 选择数据库
 * @param DbName
 * @returns
 */
function selectDb(DbName) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            redis_1.default
                .select(DbName)
                .then(() => {
                resolve(true);
            })
                .catch(redisCatch);
        });
    });
}
exports.selectDb = selectDb;
