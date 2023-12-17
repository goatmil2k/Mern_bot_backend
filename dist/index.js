"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("This is the index file");
const app_js_1 = __importDefault(require("./app.js"));
const connection_js_1 = require("./db/connection.js");
const PORT = process.env.PORT || 5000;
(0, connection_js_1.connectToDatabase)().then(() => {
    app_js_1.default.listen(PORT, () => {
        console.log("Server is loaded and connected to MongoDB");
    });
}).catch((err) => {
    console.log(err);
    throw new Error("An error occured while trying to load the server");
});
//# sourceMappingURL=index.js.map