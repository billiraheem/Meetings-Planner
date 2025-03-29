"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPassword = void 0;
const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};
exports.isValidPassword = isValidPassword;
