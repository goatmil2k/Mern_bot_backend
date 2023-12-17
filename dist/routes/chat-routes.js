"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const token_manager_1 = require("../utils/token-manager");
const validators_1 = require("../utils/validators");
const chatcontroller_1 = require("../controllers/chatcontroller");
//Protected API
const chatRoute = (0, express_1.Router)();
chatRoute.post('/new', (0, validators_1.validate)(validators_1.messageCompletionValidator), token_manager_1.verifyToken, chatcontroller_1.generateChatCompletion);
chatRoute.get('/all-chats', token_manager_1.verifyToken, chatcontroller_1.sendChatsToUser);
chatRoute.delete('/delete', token_manager_1.verifyToken, chatcontroller_1.deleteChats);
exports.default = chatRoute;
//# sourceMappingURL=chat-routes.js.map