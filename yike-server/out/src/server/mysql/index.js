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
exports.command = void 0;
const pool_1 = __importDefault(require("./pool"));
const HttpException_1 = require("../../core/HttpException");
const utils_1 = require("../../common/utils/utils");
/**
 * 数据库增删改查
 * @param command 增删改查语句
 * @param value 对应的值
 */
function command(command, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return new Promise((resolve, reject) => {
                pool_1.default.getConnection((error, connection) => {
                    // 如果连接出错, 抛出错误
                    if (error) {
                        const result = {
                            error,
                            msg: '数据库连接出错' + ':' + error.message,
                        };
                        reject(result);
                    }
                    const callback = (err, results, fields) => {
                        connection.release();
                        if (err) {
                            const result = {
                                error: err,
                                msg: err.sqlMessage || '数据库增删改查出错',
                            };
                            reject(result);
                        }
                        else {
                            const result = {
                                msg: 'ok',
                                state: 1,
                                // 将数据库里的字段, 由下划线更改为小驼峰
                                results: results instanceof Array
                                    ? results.map(utils_1.lineToHumpObject)
                                    : results,
                                fields: fields || [],
                            };
                            resolve(result);
                        }
                    };
                    // 执行mysql语句
                    if (value) {
                        pool_1.default.query(command, value, callback);
                    }
                    else {
                        pool_1.default.query(command, callback);
                    }
                });
            }).catch((error) => {
                throw new HttpException_1.DataBaseFailed(error.msg);
            });
        }
        catch (_a) {
            throw new HttpException_1.DataBaseFailed();
        }
    });
}
exports.command = command;
