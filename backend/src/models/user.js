"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
;
var userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String },
    // name: String,
    // email: String,
    // password: String,
    // isVerified: Boolean,
    // verificationToken: String,
    // refreshToken: String,
});
var User = mongoose_1.default.model('Users', userSchema);
exports.default = User;
