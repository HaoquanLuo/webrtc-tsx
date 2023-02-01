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
const mysql_1 = require("@/server/mysql");
const HttpException_1 = require("@/core/HttpException");
const verifyToken_1 = __importDefault(require("@/middlewares/verifyToken"));
const utils_1 = require("@/common/utils/utils");
const Config_1 = __importDefault(require("@/config/Config"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/user`,
});
/**
 * 获取当前用户的菜单
 */
router.post('/getUserMenu', verifyToken_1.default, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { scope: roleIds } = ctx.auth;
    // 所有的角色
    const roleRes = (yield (0, mysql_1.command)(`
      SELECT
        *
      FROM
        system_role
    `)).results;
    // 存放当前用户的角色和祖宗角色
    const roleList = [];
    // 过滤, 获取当前角色及当前角色的祖先角色的所有记录
    const each = (list, nodeId) => {
        const arr = list.filter((item) => item.id === nodeId);
        if (arr.length) {
            roleList.push(...arr);
            each(list, arr[0].parentId);
        }
    };
    // 将用户的角色ids转换为数组
    const roleIdList = roleIds
        .split(',')
        .map((str) => Number(str));
    roleIdList.forEach((roleId) => {
        each(roleRes, roleId);
    });
    // 当前角色的角色树
    const roleTree = (0, utils_1.getTreeByList)(roleList, 0);
    // 当前角色有权限的所有菜单.
    let menuList = [];
    const merge = (list) => {
        list.forEach((item) => {
            menuList = [
                ...new Set([
                    ...menuList,
                    ...item.menuIds.split(',').map((str) => Number(str)),
                ]),
            ];
            if (item.children) {
                merge(item.children);
            }
        });
    };
    // 合并当前角色和当前角色的祖先角色的所有菜单
    merge(roleTree);
    // roleId 字段，角色，与权限相关
    const res = yield (0, mysql_1.command)(`
      SELECT
          menu.id,
          menu.name title,
          menu.show,
          menu.icon,
          menu.component,
          menu.redirect,
          menu.parent_id,
          menu.path,
          menu.hide_children,
          menu.serial_num,
          menu.permission,
          menu.type
      FROM
        system_menu menu
      WHERE
          FIND_IN_SET(menu.id , '${menuList.join(',')}')
    `);
    const sortEach = (arr) => {
        (0, utils_1.sort)(arr, 'serialNum', 'desc');
        arr.forEach((item) => {
            if (item.children) {
                sortEach(item.children);
            }
        });
    };
    // 根据serialNum排序
    sortEach(res.results);
    // 构建前端需要的menu树
    const list = res.results.map(({ name, parentId, id, icon, title, show, component, redirect, path, hideChildren, children, serialNum, permission, type, }) => {
        const isHideChildren = Boolean(hideChildren);
        const isShow = Boolean(show);
        return {
            name,
            parentId,
            id,
            meta: {
                icon,
                title,
                show: isShow,
                hideChildren: isHideChildren,
            },
            component,
            redirect,
            path,
            children,
            serialNum,
            permission,
            type,
        };
    });
    throw new HttpException_1.Success(list);
}));
exports.default = router;
