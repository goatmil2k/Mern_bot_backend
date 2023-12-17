"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageCompletionValidator = exports.signUpValidator = exports.logInValidator = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ error: errors.array() });
    };
};
exports.validate = validate;
exports.logInValidator = [
    (0, express_validator_1.body)("email").trim().isEmail().withMessage("Email is required"),
    (0, express_validator_1.body)("password").trim().isLength({ min: 6 }).withMessage("Password should be at least 6 characters")
];
exports.signUpValidator = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"),
    ...exports.logInValidator
];
exports.messageCompletionValidator = [
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message is required")
];
//# sourceMappingURL=validators.js.map