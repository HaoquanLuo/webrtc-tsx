"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redisConfing_1 = __importDefault(require("./redisConfing"));
const IoreDis_1 = __importDefault(require("IoreDis"));
const redis = new IoreDis_1.default(redisConfing_1.default);
exports.default = redis;
setInterval(() => {
    redis.exists('0');
}, 15000);
