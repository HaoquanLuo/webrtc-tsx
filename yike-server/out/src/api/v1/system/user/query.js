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
const Config_1 = __importDefault(require("@/config/Config"));
const verifyToken_1 = __importDefault(require("@/middlewares/verifyToken"));
const router = new koa_router_1.default({
    prefix: `${Config_1.default.API_PREFIX}v1/system/user`,
});
router.get('/query', verifyToken_1.default, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = ctx.auth;
    // 查询获取所有的菜单(包括菜单目录和按钮)
    const AllMenulist = (yield (0, mysql_1.command)(`
    SELECT
        user.user_name,
        user.email,
        user.info infoStr,
        user.deleted,
        role.name roleName,
        role.id roleId,
        role.menu_ids,
        role.parent_id roleParentId,
        menu.name menuName,
        menu.id menuId,
        menu.type menuType,
        menu.show,
        menu.serial_num,
        menu.parent_id menuParentId,
        menu.permission menuPermission
    FROM
        system_user user,
        system_role role,
        system_menu menu
    WHERE
        user.id = ${uid}
        AND FIND_IN_SET(role.id , user.role_ids)
        AND FIND_IN_SET(menu.id , role.menu_ids)
  `)).results.map((item) => {
        item.info = JSON.parse(item.infoStr);
        return Object.assign({}, item);
    });
    // 上面的查询会有重复, 过滤重复数据
    const filterMenuList = [];
    AllMenulist.forEach((element) => {
        const info = JSON.parse(element.infoStr);
        const data = filterMenuList.find((item) => info.nickName === item.info.nickName &&
            element.roleIds === item.roleIds &&
            element.menuId === item.menuId);
        if (!data) {
            filterMenuList.push(element);
        }
    });
    const { info, roleName, userName, roleId, email } = AllMenulist[0];
    // 将数据转换为前端需要的数据结构
    const menuList = filterMenuList.map((item) => {
        return {
            roleId: item.roleId,
            roleName: item.roleName,
            id: item.menuId,
            menuType: item.menuType,
            name: item.menuName,
            show: item.show,
            serialNum: item.serialNum,
            actions: [],
            parentId: item.menuParentId,
            permission: item.menuPermission,
        };
    });
    // 获取所有的操作(即按钮)
    const allActions = menuList.filter((item) => item.menuType === 3);
    // 获取所有的菜单目录和菜单
    const allMenu = menuList.filter((item) => item.menuType === 1 || item.menuType === 2) || [];
    // 根据parentId给菜单添加操作
    allMenu.forEach((menu) => {
        menu.actions = allActions
            .filter((item) => item.parentId === menu.id)
            .map((item) => {
            return {
                id: item.id,
                serialNum: item.serialNum,
                permission: item.permission,
            };
        });
    });
    const userInfo = {
        userName,
        email,
        info,
        role: {
            roleName,
            roleId,
            permissions: allMenu,
        },
    };
    throw new HttpException_1.Success(userInfo);
}));
exports.default = router;
