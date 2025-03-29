"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./src/server/server"));
const DB_1 = __importDefault(require("./src/config/DB"));
const PORT = process.env.PORT || 8080;
// Connect to database and start the server
(0, DB_1.default)().then(() => {
    server_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
});
// import { server } from "./src/server/server";
// const PORT = process.env.PORT || 8080;
// server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
