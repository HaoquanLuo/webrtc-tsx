"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var REDIS_DB_NAME;
(function (REDIS_DB_NAME) {
    REDIS_DB_NAME[REDIS_DB_NAME["DEFAULT"] = 0] = "DEFAULT";
    REDIS_DB_NAME[REDIS_DB_NAME["ROLE"] = 1] = "ROLE";
    REDIS_DB_NAME[REDIS_DB_NAME["TOKEN"] = 2] = "TOKEN";
})(REDIS_DB_NAME || (REDIS_DB_NAME = {}));
exports.default = REDIS_DB_NAME;
