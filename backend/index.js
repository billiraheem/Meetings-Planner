"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./src/server/server");
var PORT = process.env.PORT || 8080;
server_1.server.listen(PORT, function () { return console.log("Server running on http://localhost:".concat(PORT)); });
