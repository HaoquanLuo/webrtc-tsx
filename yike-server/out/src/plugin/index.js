"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPlugin = void 0;
const SocketServer_1 = require("./SocketServer");
const allPlugin = {
    SocketServer: SocketServer_1.SocketServer,
};
function initPlugin(options) {
    options.pluginNames.forEach((pluginName) => {
        new allPlugin[pluginName](options);
    });
}
exports.initPlugin = initPlugin;
