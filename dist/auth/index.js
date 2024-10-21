"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractAuthUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SocketManager_1 = require("../SocketManager");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const extractAuthUser = (token, ws) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        console.log('Decoded token:', decoded);
        return new SocketManager_1.User(ws, decoded);
    }
    catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid token');
    }
};
exports.extractAuthUser = extractAuthUser;
