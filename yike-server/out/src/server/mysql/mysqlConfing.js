"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = __importDefault(require("../../config/Config"));
exports.default = {
    host: Config_1.default.MYSQL.HOST,
    port: Config_1.default.MYSQL.PORT,
    user: Config_1.default.MYSQL.USER_NAME,
    password: Config_1.default.MYSQL.PASSWORD,
    database: Config_1.default.MYSQL.DB_NAME,
    multipleStatements: true,
    connectionLimit: Config_1.default.MYSQL.CONNECTION_LIMIT,
    connectTimeout: Config_1.default.MYSQL.CONNECT_TIMEOUT,
    acquireTimeout: Config_1.default.MYSQL.ACQUIRE_TIMEOUT,
    timeout: Config_1.default.MYSQL.TIMEOUT,
};
