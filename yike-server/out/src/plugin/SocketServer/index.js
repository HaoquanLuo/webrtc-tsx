"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const socket_io_1 = require("socket.io");
const logger_1 = __importDefault(require("@/server/logs/logger"));
const SocketServerEventHandler_1 = require("@/plugin/SocketServer/SocketServerEventHandler");
class SocketServer {
    constructor(options) {
        const { pluginNames, app, server } = options;
        const sio = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            },
        });
        // 监听客户端 socket 连接
        sio.on('connection', (socket) => {
            logger_1.default.info(`[Socket Server] User '${socket.id}' connected.`);
            SocketServerEventHandler_1.SocketEventHandler.addSocketUser(socket.id);
            socket.on('room-create', (data) => {
                SocketServerEventHandler_1.SocketEventHandler.createRoomHandler(data, socket);
            });
            socket.on('room-join', (data) => {
                SocketServerEventHandler_1.SocketEventHandler.joinRoomHandler(data, socket, sio);
            });
            socket.on('room-leave', () => {
                SocketServerEventHandler_1.SocketEventHandler.leaveRoomHandler(socket, sio);
            });
            socket.on('disconnect', () => {
                logger_1.default.info(`[Socket Server] User '${socket.id}' disconnected.`);
                SocketServerEventHandler_1.SocketEventHandler.disconnectHandler(socket, sio);
            });
            socket.on('conn-signal', (data) => {
                SocketServerEventHandler_1.SocketEventHandler.signalingDataHandler(data, socket, sio);
            });
            socket.on('conn-init', (data) => {
                SocketServerEventHandler_1.SocketEventHandler.initPeerConnectionHandler(data, socket, sio);
            });
            socket.on('direct-message', (data) => {
                SocketServerEventHandler_1.SocketEventHandler.transportDirectMessageHandler(data, socket);
            });
        });
    }
}
exports.SocketServer = SocketServer;
