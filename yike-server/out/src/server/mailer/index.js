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
exports.sendEmail = void 0;
const HttpException_1 = require("../../core/HttpException");
const transporter_1 = __importDefault(require("./transporter"));
/**
 * 发送邮件
 * @param { MailOptions } mailOptions
 * @returns
 */
function sendEmail({ from = '"逸课" <1223048059@qq.com>', to, subject, text, html, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const mailOptions = {
                from,
                to,
                subject,
                text,
                html,
            };
            mailOptions.from = from;
            mailOptions.to = to;
            mailOptions.subject = subject;
            mailOptions.text = text;
            mailOptions.html = html;
            transporter_1.default
                .sendMail(mailOptions)
                .then((res) => {
                if (res.response.indexOf('250') > -1) {
                    resolve(true);
                }
                else {
                    reject();
                }
            });
        }).catch((error) => {
            throw new HttpException_1.HttpException(error.msg);
        });
    });
}
exports.sendEmail = sendEmail;
