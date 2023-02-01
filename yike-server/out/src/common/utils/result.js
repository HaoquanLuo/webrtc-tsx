"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
function getPagination(records, total, pageSize, pageNum) {
    return {
        records,
        total,
        pageSize: pageSize,
        current: pageNum,
        pages: Math.ceil(total / pageSize),
    };
}
exports.getPagination = getPagination;
