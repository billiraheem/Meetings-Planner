"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const DB_1 = __importDefault(require("./src/config/DB"));
const PORT = process.env.PORT || 8000;
// Connect to database and start the server
(0, DB_1.default)().then(() => {
    index_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
