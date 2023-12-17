"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.verifyUser = exports.userLogIn = exports.userSignUp = exports.getAllUser = void 0;
const user_js_1 = __importDefault(require("../models/user.js"));
const bcrypt_1 = require("bcrypt");
const token_manager_js_1 = require("../utils/token-manager.js");
const constants_js_1 = require("../utils/constants.js");
const getAllUser = async (req, res, Next) => {
    try {
        const users = await user_js_1.default.find().then();
        return res.status(200).json({ message: "Ok", users });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.getAllUser = getAllUser;
const userSignUp = async (req, res, Next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await user_js_1.default.findOne({ email });
        if (existingUser)
            return res.status(401).send("This user is already registered");
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        const user = new user_js_1.default({ name, email, password: hashedPassword });
        await user.save();
        //Create token and store cookie
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });
        const token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, '7d');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_js_1.COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        return res.status(201).json({ message: "Ok", name: user.name, email: user.email });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.userSignUp = userSignUp;
const userLogIn = async (req, res, Next) => {
    try {
        const { email, password } = req.body;
        const user = await user_js_1.default.findOne({ email });
        if (!user) {
            return res.status(401).send("User is not registered");
        }
        const isPasswordCorrect = await (0, bcrypt_1.compare)(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).send("Password is incorrect");
        }
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });
        const token = (0, token_manager_js_1.createToken)(user._id.toString(), user.email, '7d');
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(constants_js_1.COOKIE_NAME, token, { path: '/', domain: 'localhost', expires, httpOnly: true, signed: true });
        console.log(user._id);
        return res.status(200).json({ message: "Ok", name: user.name, email: user.email });
    }
    catch (error) {
        console.log(error);
        return res.json({ message: "Error", cause: error.message });
    }
};
exports.userLogIn = userLogIn;
const verifyUser = async (req, res, Next) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await user_js_1.default.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        console.log(user._id.toString(), localId);
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }
        return res.status(200).json({ message: "Ok", name: user.name, email: user.email });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.verifyUser = verifyUser;
const logoutUser = async (req, res, Next) => {
    try {
        const localId = res.locals.jwtData.id;
        const user = await user_js_1.default.findById(localId);
        if (!user) {
            return res.status(401).send("User is not registered or token malfunctioned");
        }
        if (user._id.toString() !== localId) {
            return res.status(401).send("Permission Denied");
        }
        res.clearCookie(constants_js_1.COOKIE_NAME, {
            httpOnly: true,
            domain: 'localhost',
            signed: true,
            path: '/'
        });
        return res.status(200).json({ message: "Ok" });
    }
    catch (err) {
        console.log(err);
        return res.json({ message: "Error", cause: err.message });
    }
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=usercontroller.js.map