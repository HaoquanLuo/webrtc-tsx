"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const moment_1 = __importDefault(require("moment"));
const Config_1 = __importDefault(require("../../config/Config"));
/**
 * 格式化时间
 * @param date
 * @param pattern
 * @returns
 */
function format(date, pattern = Config_1.default.DEFAULT_DATE_FORMAT) {
    return (0, moment_1.default)(date).format(pattern);
}
exports.format = format;
