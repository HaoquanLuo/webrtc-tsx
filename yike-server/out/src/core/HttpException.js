"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketException = exports.DataBaseFailed = exports.QueryFailed = exports.Forbidden = exports.AuthFailed = exports.NotFound = exports.Buffer = exports.Success = exports.ParameterException = exports.HttpException = void 0;
// http异常
class HttpException extends Error {
    constructor(data, msg = '服务器异常，请联系管理员', errorCode = 10000, code = 400) {
        super();
        this.isBuffer = false;
        this.message = msg;
        this.errorCode = errorCode;
        this.code = code;
        this.data = data;
    }
}
exports.HttpException = HttpException;
// http参数异常
class ParameterException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 422;
        this.message = msg || '参数错误';
        this.errorCode = errorCode || 10000;
    }
}
exports.ParameterException = ParameterException;
// http请求成功
class Success extends HttpException {
    constructor(data, msg = 'ok', code = 200, errorCode = 0, responseType, session) {
        super();
        this.code = code; //200查询成功，201操作成功
        this.message = msg;
        this.errorCode = errorCode || 0;
        this.data = data;
        this.responseType = responseType;
        this.session = session;
    }
}
exports.Success = Success;
// 返回文件流
class Buffer extends Success {
    constructor(data, responseType, session) {
        super();
        this.code = 200; //200查询成功，201操作成功
        this.message = 'ok';
        this.errorCode = 0;
        this.data = data;
        this.responseType = responseType;
        this.session = session;
        this.isBuffer = true;
    }
}
exports.Buffer = Buffer;
// 404
class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 404;
        this.message = msg || '资源未找到';
        this.errorCode = errorCode || 10001;
    }
}
exports.NotFound = NotFound;
// 授权失败
class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 401;
        this.message = msg || '授权失败';
        this.errorCode = errorCode || 10002;
    }
}
exports.AuthFailed = AuthFailed;
// Forbidden
class Forbidden extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 403;
        this.message = msg || '禁止访问';
        this.errorCode = errorCode || 10003;
    }
}
exports.Forbidden = Forbidden;
// 查询失败
class QueryFailed extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 500;
        this.message = msg || '未查到匹配的数据';
        this.errorCode = errorCode || 10004;
    }
}
exports.QueryFailed = QueryFailed;
// 数据库出错
class DataBaseFailed extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 500;
        this.message = msg || '数据库出错';
        this.errorCode = errorCode || 10005;
    }
}
exports.DataBaseFailed = DataBaseFailed;
// socket 出错
class SocketException extends HttpException {
    constructor(msg, errorCode) {
        super();
        this.code = 500;
        this.message = msg || 'Socket.io 出错';
        this.errorCode = errorCode || 10006;
    }
}
exports.SocketException = SocketException;
