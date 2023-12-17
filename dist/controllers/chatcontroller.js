"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteChats = exports.sendChatsToUser = exports.generateChatCompletion = void 0;
const user_1 = __importDefault(require("../models/user"));
const openaiconfig_1 = require("../config/openaiconfig");
const openai_1 = require("openai");
const generateChatCompletion = async (req, res, Next) => {
    const { message } = req.body;
    try {
        const localId = res.locals.jwtData.id;
        const user = await user_1.default.findById(localId);
        if (!user) {
            return res.status(401).json({ message: "User not registered or token malfunctioned" });
        }
        //grab chats of user
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: "user" });
        user.chats.push({ content: message, role: "user" });
        //send all chats with new one to openAI API
        const config = (0, openaiconfig_1.configureOpenAi)();
        const openai = new openai_1.OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: chats,
        });
        if (chatResponse.data.choices && chatResponse.data.choices.length > 0) {
            user.chats.push(chatResponse.data.choices[0].message);
            await user.save();
            return res.status(200).json({ chats: user.chats });
        }
        else {
            throw new Error("Unexpected response structure from OpenAI API");
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Something Went Wrong" });
    }
};
exports.generateChatCompletion = generateChatCompletion;
const sendChatsToUser = async (req, res, Next) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await user_1.default.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }
        return res.status(200).json({ message: "Ok", chats: user.chats });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.sendChatsToUser = sendChatsToUser;
const deleteChats = async (req, res, Next) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await user_1.default.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "Ok" });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.deleteChats = deleteChats;
//# sourceMappingURL=chatcontroller.js.map