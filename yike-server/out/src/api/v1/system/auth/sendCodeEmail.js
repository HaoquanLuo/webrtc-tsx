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
const koa_router_1 = __importDefault(require("koa-router"));
const Config_1 = __importDefault(require("@/config/Config"));
const HttpException_1 = require("@/core/HttpException");
const mysql_1 = require("@/server/mysql");
const validator_1 = __importDefault(require("@/middlewares/validator"));
const sendCodeEmail_1 = __importDefault(require("@/common/apiJsonSchema/system/auth/sendCodeEmail"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/auth`,
});
router.post('/sendCodeEmail', (0, validator_1.default)(sendCodeEmail_1.default, 'body'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, userName } = ctx.request.body;
    yield checkUserNameAndEmail(userName, email);
    // let code = (Math.random() * 1000000).toFixed()
    // if (code.length < 6) {
    //   code += 0
    // }
    /**
     * @todo 为了方便将邮件验证码改为123456，上线前要改回去
     */
    const code = (123456).toFixed();
    // 在会话中添加验证码字段code
    ctx.session.code = code;
    console.log('邮件验证码:', ctx.session.code, typeof ctx.session.code);
    // 发送邮件
    // await sendEmail({
    //   to: email,
    //   subject: '验证码',
    //   text: '验证码',
    //   html: `
    //         <div >
    //             <p>您正在注册逸课平台帐号，用户名<b>${userName}</b>，
    //             验证邮箱为<b>${email}</b> 。
    //             验证码为：</p>
    //             <p style="color: green;font-weight: 600;margin: 0 6px;text-align: center; font-size: 20px">
    //               ${code}
    //             </p>
    //             <p>请在注册页面填写该改验证码</p>
    //         </div>
    //     `,
    // })
    throw new HttpException_1.Success();
}));
exports.default = router;
/**
 * 邮箱和用户名作为唯一值需要校验是否已经有用户在使用
 * @param { string } userName
 * @param { string } email
 * @returns
 */
function checkUserNameAndEmail(userName, email) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, mysql_1.command)(`
      SELECT
        user_name,
        email
      FROM
        system_user
      where
        user_name = '${userName}'
      or
        email = '${email}'
    `);
            if (res.results.length > 0) {
                const userNameList = res.results.filter((item) => item.userName === userName);
                const emailList = res.results.filter((item) => item.email === email);
                const msgList = [];
                if (userNameList.length > 0) {
                    msgList.push('该用户名已被注册');
                }
                if (emailList.length > 0) {
                    msgList.push('该邮箱已被注册');
                }
                reject(msgList.join(','));
            }
            else {
                resolve(undefined);
            }
        })).catch((err) => {
            throw new HttpException_1.HttpException('', err);
        });
    });
}
