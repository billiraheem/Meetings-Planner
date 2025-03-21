"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var url_1 = require("url");
var DB_1 = require("../config/DB");
var meetingController_1 = require("../controllers/meetingController");
// Connect to MongoDB
(0, DB_1.default)();
var server = (0, http_1.createServer)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var method, url, parsedUrl, pathname, query, body, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                method = req.method, url = req.url;
                parsedUrl = new url_1.URL(url || '', "http://".concat(req.headers.host));
                pathname = parsedUrl.pathname;
                query = parsedUrl.searchParams;
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                if (method === 'OPTIONS') {
                    res.writeHead(204).end();
                    return [2 /*return*/];
                }
                body = '';
                req.on('data', function (chunk) { return (body += chunk.toString()); });
                return [4 /*yield*/, new Promise(function (resolve) { return req.on('end', resolve); })];
            case 1:
                _a.sent();
                if (pathname === '/api/meetings') {
                    switch (method) {
                        case 'GET':
                            (0, meetingController_1.handleGetMeetings)(req, res, query);
                            break;
                        case 'POST':
                            (0, meetingController_1.handleCreateMeeting)(req, res, body);
                            break;
                        default:
                            res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }));
                    }
                }
                else if (pathname.startsWith('/api/meetings')) {
                    id = pathname.split('/')[3];
                    switch (method) {
                        case 'GET':
                            (0, meetingController_1.handleGetMeeting)(req, res, id);
                            break;
                        case 'PUT':
                            (0, meetingController_1.handleUpdateMeeting)(req, res, id, body);
                            break;
                        case 'DELETE':
                            (0, meetingController_1.handleDeleteMeeting)(req, res, id);
                            break;
                        default:
                            res.writeHead(405).end(JSON.stringify({ error: 'Method Not Allowed' }));
                    }
                }
                else {
                    res.writeHead(404).end(JSON.stringify({ error: 'Not Found' }));
                }
                return [2 /*return*/];
        }
    });
}); });
var PORT = process.env.PORT || 8080;
server.listen(PORT, function () { return console.log("Server running on http://localhost:".concat(PORT)); });
