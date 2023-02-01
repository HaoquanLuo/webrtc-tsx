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
exports.updateRoles = exports.updateRedisRole = exports.getAllRolePermission = exports.getRedisUserPermission = exports.getUserPermission = exports.generateToken = void 0;
const Config_1 = __importDefault(require("../../config/Config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mysql_1 = require("../mysql");
const redis_1 = require("../redis");
const utils_1 = require("../../common/utils/utils");
const redis_2 = __importDefault(require("../redis/redis"));
/**
 * 构建token
 * @param uid
 * @param scope
 * @returns
 */
function generateToken(uid, scope) {
    //传入id和权限
    const secretKey = Config_1.default.SECURITY.SECRET_KEY;
    const expiresIn = Config_1.default.SECURITY.EXPIRES_IN;
    const token = jsonwebtoken_1.default.sign({
        uid,
        scope,
    }, secretKey, {
        expiresIn,
    });
    return token;
}
exports.generateToken = generateToken;
/**
 * 获取用户权限
 * @param decode
 * @returns
 */
function getUserPermission(decode) {
    const { scope } = decode;
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield (0, mysql_1.command)(`
          SELECT
            menu_ids
          FROM
            system_role
          where
            id = ${scope}
      `);
            if (!res.error) {
                const role = res.results[0];
                if (role) {
                    const menuList = (yield (0, mysql_1.command)(`
              SELECT
                permission
              FROM
                system_menu
              WHERE
                FIND_IN_SET(
                id,
                '${role.menuIds}')
            `)).results;
                    resolve(menuList);
                }
                else {
                    resolve([]);
                }
            }
            else {
                reject();
            }
        }
        catch (error) {
            console.log(error);
            reject();
        }
    }));
}
exports.getUserPermission = getUserPermission;
/**
 * 校验用户权限
 * @param decode
 * @returns
 */
function getRedisUserPermission(decode) {
    const { scope } = decode;
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        (0, redis_1.selectDb)(Config_1.default.REDIS_DB_NAME.ROLE).then(() => {
            redis_2.default.keys('*').then((res) => __awaiter(this, void 0, void 0, function* () {
                Promise.all(res.map((item) => redis_2.default.hgetall(item))).then((result) => {
                    const allRoleList = result.map((item) => {
                        return Object.assign(Object.assign({}, item), { id: Number(item.id), parentId: Number(item.parentId) });
                    });
                    const roleTree = (0, utils_1.getTreeByList)(allRoleList, 0);
                    // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
                    const roleList = [];
                    const each = (list, nodeId) => {
                        const arr = list.filter((item) => item.id === nodeId);
                        if (arr.length) {
                            roleList.push(...arr);
                            each(list, arr[0].parentId);
                        }
                    };
                    const roleIds = scope.split(',');
                    roleIds.forEach((roleId) => {
                        each(roleTree, Number(roleId));
                    });
                    // 当前角色有权限的所有权限.
                    let permissionList = [];
                    const merge = (list) => {
                        list.forEach((item) => {
                            permissionList = [...new Set([...permissionList, ...item.permissions.split(',')])];
                            if (item.children) {
                                merge(item.children);
                            }
                        });
                    };
                    // 合并当前角色和当前角色的祖先角色的所有菜单
                    merge(roleTree);
                    resolve(permissionList);
                });
            }));
        });
    }));
}
exports.getRedisUserPermission = getRedisUserPermission;
/**
 * 获取所有角色的权限列表
 * @returns
 */
function getAllRolePermission() {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield (0, mysql_1.command)(`
          SELECT
            id,
            menu_ids,
            parent_id parentId,
            name
          FROM
            system_role
      `);
            if (!res.error) {
                const RoleList = [];
                for (let i = 0; i < res.results.length; i++) {
                    const item = res.results[i];
                    RoleList.push({
                        id: item.id,
                        parentId: item.parentId,
                        name: item.name,
                        menuList: yield getUserPermission({
                            scope: String(item.id),
                            uid: 0,
                        }),
                    });
                }
                resolve(RoleList);
            }
            else {
                reject();
            }
        }
        catch (error) {
            console.log(error);
            reject();
        }
    }));
}
exports.getAllRolePermission = getAllRolePermission;
/**
 * 更新redis里的角色
 */
function updateRedisRole() {
    getAllRolePermission().then((list) => {
        list.forEach((res) => {
            if (res.menuList.length > 0) {
                updateRoles((res.id || '').toString(), new Map([
                    ['id', res.id.toString()],
                    ['parentId', res.parentId.toString()],
                    ['permissions', res.menuList.map((item) => item.permission).join(',')],
                ]));
            }
        });
    });
}
exports.updateRedisRole = updateRedisRole;
/**
 * 更新权限
 * @param roleId
 * @param obj
 * @returns
 */
function updateRoles(roleId, obj) {
    return new Promise((resolve) => {
        (0, redis_1.selectDb)(Config_1.default.REDIS_DB_NAME.ROLE).then(() => __awaiter(this, void 0, void 0, function* () {
            yield redis_2.default.del(roleId);
            redis_2.default.hmset(roleId, obj).then((res) => {
                const result = {
                    msg: 'ok',
                    state: 1,
                    results: res,
                    fields: [],
                };
                resolve(result);
            });
        }));
    });
}
exports.updateRoles = updateRoles;
