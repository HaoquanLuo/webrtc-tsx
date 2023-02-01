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
exports.sort = exports.getTreeByList = exports.humpToLineObject = exports.lineToHumpObject = exports.humpToLine = exports.lineToHump = exports.isValidKey = exports.isDirectory = exports.getAllFilesExport = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_1 = require("./date");
/**
 * 获取某个目录下所有文件的默认导出
 * @param filePath 需要遍历的文件路径
 */
function getAllFilesExport(filePath, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        // 根据文件路径读取文件，返回一个文件列表
        const files = fs_1.default.readdirSync(filePath);
        // 遍历读取到的文件列表
        files.forEach((fileName) => {
            // path.join得到当前文件的绝对路径
            const absFilePath = path_1.default.join(filePath, fileName);
            const stats = fs_1.default.statSync(absFilePath);
            const isFile = stats.isFile(); // 是否为文件
            const isDir = stats.isDirectory(); // 是否为文件夹
            if (isFile) {
                const file = require(absFilePath);
                callback(file.default);
            }
            if (isDir) {
                getAllFilesExport(absFilePath, callback); // 递归，如果是文件夹，就继续遍历该文件夹里面的文件；
            }
        });
    });
}
exports.getAllFilesExport = getAllFilesExport;
/**
 * 判断某个文件夹是否存在
 * @param path
 * @returns {boolean}
 */
function isDirectory(path) {
    try {
        const stat = fs_1.default.statSync(path);
        return stat.isDirectory();
    }
    catch (error) {
        return false;
    }
}
exports.isDirectory = isDirectory;
function isValidKey(key, object) {
    return key in object;
}
exports.isValidKey = isValidKey;
/**
 * 下划线转驼峰
 * @param str
 * @returns
 */
function lineToHump(str) {
    if (str.startsWith('_')) {
        return str;
    }
    return str.replace(/\_(\w)/g, (all, letter) => letter.toUpperCase());
}
exports.lineToHump = lineToHump;
/**
 * 驼峰转下划线
 * @param str
 * @returns
 */
function humpToLine(str = '') {
    if (typeof str !== 'string') {
        return str;
    }
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}
exports.humpToLine = humpToLine;
/**
 * 将对象的所有属性由下划线转换成驼峰
 * @param obj
 * @returns
 */
function lineToHumpObject(obj) {
    let key;
    const element = {};
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isValidKey(key, obj)) {
                const value = obj[key];
                if (typeof key === 'string' && key.indexOf('_at') > -1) {
                    element[lineToHump(key)] = (0, date_1.format)(value);
                }
                else {
                    element[lineToHump(key)] = value;
                }
            }
        }
    }
    return Object.assign({}, element);
}
exports.lineToHumpObject = lineToHumpObject;
/**
 * 将对象的所有属性由驼峰转换为下划线
 * @param obj
 * @returns
 */
function humpToLineObject(obj) {
    let key;
    const element = {};
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (isValidKey(key, obj)) {
                const value = obj[key];
                element[humpToLine(key)] = value || null;
            }
        }
    }
    return Object.assign({}, element);
}
exports.humpToLineObject = humpToLineObject;
/**
 * 将数组变成树
 * @param list
 * @param rootId
 * @param options
 * @returns
 */
function getTreeByList(list, rootId, options) {
    // 属性配置设置
    const attr = {
        id: (options === null || options === void 0 ? void 0 : options.id) || 'id',
        parentId: (options === null || options === void 0 ? void 0 : options.parentId) || 'parentId',
        rootId,
    };
    const toTreeData = (data, attr) => {
        const tree = [];
        const resData = data;
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].parentId === attr.rootId) {
                const obj = Object.assign(Object.assign({}, resData[i]), { id: resData[i][attr.id], children: [] });
                tree.push(obj);
                resData.splice(i, 1);
                i--;
            }
        }
        const run = (treeArrs) => {
            if (resData.length > 0) {
                for (let i = 0; i < treeArrs.length; i++) {
                    for (let j = 0; j < resData.length; j++) {
                        if (treeArrs[i].id === resData[j][attr.parentId]) {
                            const obj = Object.assign(Object.assign({}, resData[j]), { id: resData[j][attr.id], children: [] });
                            treeArrs[i].children.push(obj);
                            resData.splice(j, 1);
                            j--;
                        }
                    }
                    run(treeArrs[i].children);
                }
            }
        };
        run(tree);
        return tree;
    };
    const arr = toTreeData(list, attr);
    return arr;
}
exports.getTreeByList = getTreeByList;
/**
 * 根据某个属性排序
 * @param arr
 * @param propName
 * @param type
 */
function sort(arr, propName, type) {
    arr.sort((a, b) => {
        if (type === 'asc') {
            return b[propName] - a[propName];
        }
        else {
            return a[propName] - b[propName];
        }
    });
}
exports.sort = sort;
