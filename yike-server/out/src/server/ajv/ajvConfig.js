"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
exports.default = {
    allErrors: Config_1.default.IS_DEV, // 是否输出所有的错误（比较慢）
};
