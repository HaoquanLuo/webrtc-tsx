"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const ajv_1 = __importDefault(require("./ajv"));
/**
 * json schema 校验
 * @param {Object} schema json schema 规则
 * @param {Object} data 待校验的数据
 */
function validate(schema, data = {}) {
    const valid = ajv_1.default.validate(schema, data);
    if (!valid) {
        return ajv_1.default.errorsText();
    }
}
exports.validate = validate;
