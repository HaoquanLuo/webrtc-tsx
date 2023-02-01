"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
exports.default = {
    port: Config_1.default.REDIS.PORT,
    host: Config_1.default.REDIS.HOST,
    // password: Config.REDIS.PASSWORD,
    db: Config_1.default.REDIS.DB,
};
