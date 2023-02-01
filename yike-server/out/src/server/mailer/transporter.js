"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailerConfing_1 = __importDefault(require("./mailerConfing"));
// 开启一个 SMTP 连接池
const transporter = nodemailer_1.default.createTransport(mailerConfing_1.default);
exports.default = transporter;
