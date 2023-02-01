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
exports.deleteToken = exports.getTokenValue = exports.saveToken = void 0;
const Config_1 = __importDefault(require("../../config/Config"));
const redis_1 = require("../redis");
const redis_2 = __importDefault(require("../redis/redis"));
/**
 * 保存token
 * @param key
 * @param uid
 * @returns
 */
function saveToken(key, uid) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            (0, redis_1.selectDb)(Config_1.default.SECURITY.TOKEN_REDIS_DB).then(() => {
                redis_2.default.setex(key, Config_1.default.SECURITY.EXPIRES_IN, uid).then((res) => {
                    const result = {
                        msg: 'ok',
                        state: 1,
                        results: res,
                        fields: [],
                    };
                    resolve(result);
                });
            });
        });
    });
}
exports.saveToken = saveToken;
/**
 * 获取token的值
 * @param key
 * @returns
 */
function getTokenValue(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            (0, redis_1.selectDb)(Config_1.default.SECURITY.TOKEN_REDIS_DB).then(() => {
                redis_2.default.get(key).then((res) => {
                    const result = {
                        msg: 'ok',
                        state: 1,
                        results: res,
                        fields: [],
                    };
                    resolve(result);
                });
            });
        });
    });
}
exports.getTokenValue = getTokenValue;
/**
 * 删除token
 * @param key
 * @returns
 */
function deleteToken(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            (0, redis_1.selectDb)(Config_1.default.SECURITY.TOKEN_REDIS_DB).then(() => {
                redis_2.default.del(key).then((res) => {
                    const result = {
                        msg: 'ok',
                        state: 1,
                        results: res,
                        fields: [],
                    };
                    resolve(result);
                });
            });
        });
    });
}
exports.deleteToken = deleteToken;
