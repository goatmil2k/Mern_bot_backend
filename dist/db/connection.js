"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectFromDatabase = exports.connectToDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
const errorMessage = "Cannot connect to MongoDB";
async function connectToDatabase() {
    try {
        let url = process.env.MONGODB_URL;
        if (!url) {
            throw new Error(errorMessage);
        }
        await mongoose_1.default.connect(url);
    }
    catch (error) {
        console.log(error);
        throw new Error(errorMessage);
    }
}
exports.connectToDatabase = connectToDatabase;
async function disconnectFromDatabase() {
    try {
        await mongoose_1.default.disconnect();
    }
    catch (error) {
        console.log(error);
        throw new Error("Could not disconnect from MongoDB");
    }
}
exports.disconnectFromDatabase = disconnectFromDatabase;
//# sourceMappingURL=connection.js.map