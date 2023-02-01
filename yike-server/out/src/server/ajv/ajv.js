"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajvConfig_1 = __importDefault(require("./ajvConfig"));
const ajv = new ajv_1.default(ajvConfig_1.default);
exports.default = ajv;
