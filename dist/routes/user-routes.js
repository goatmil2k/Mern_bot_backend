"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usercontroller_js_1 = require("../controllers/usercontroller.js");
const validators_js_1 = require("../utils/validators.js");
const token_manager_js_1 = require("../utils/token-manager.js");
const userRoute = (0, express_1.Router)();
userRoute.get('/', usercontroller_js_1.getAllUser);
userRoute.post('/signup', (0, validators_js_1.validate)(validators_js_1.signUpValidator), usercontroller_js_1.userSignUp);
userRoute.post('/login', (0, validators_js_1.validate)(validators_js_1.logInValidator), usercontroller_js_1.userLogIn);
userRoute.get('/auth-status', token_manager_js_1.verifyToken, usercontroller_js_1.verifyUser);
userRoute.get('/logout', token_manager_js_1.verifyToken, usercontroller_js_1.logoutUser);
exports.default = userRoute;
//# sourceMappingURL=user-routes.js.map