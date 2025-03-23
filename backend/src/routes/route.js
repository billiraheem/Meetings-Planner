"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHandler = void 0;
var url_1 = require("url");
var meetingController_1 = require("../controllers/meetingController");
var errorHandler_1 = require("../middlewares/errorHandler");
var routes = {
    'GET /api/meetings': function (req, res, _, body) { return (0, meetingController_1.handleGetMeetings)(req, res, new url_1.URL(req.url, "http://".concat(req.headers.host)).searchParams); },
    'POST /api/meetings': function (req, res, _, body) { return (0, meetingController_1.handleCreateMeeting)(req, res, body); },
    'GET /api/meetings/:id': function (req, res, params) { return (0, meetingController_1.handleGetMeeting)(req, res, params.id); },
    'PUT /api/meetings/:id': function (req, res, params, body) { return (0, meetingController_1.handleUpdateMeeting)(req, res, params.id, body); },
    'DELETE /api/meetings/:id': function (req, res, params) { return (0, meetingController_1.handleDeleteMeeting)(req, res, params.id); },
};
var routeHandler = function (req, res, body) {
    var parsedUrl = new url_1.URL(req.url || '', "http://".concat(req.headers.host));
    var pathname = parsedUrl.pathname;
    var method = req.method;
    var dynamicRoute = Object.keys(routes).find(function (route) {
        var _a = route.split(' '), routeMethod = _a[0], routePath = _a[1];
        if (routeMethod !== method)
            return false;
        var routeSegments = routePath.split('/');
        var requestSegments = pathname.split('/');
        if (routeSegments.length !== requestSegments.length)
            return false;
        return routeSegments.every(function (seg, i) { return seg.startsWith(':') || seg === requestSegments[i]; });
    });
    if (dynamicRoute) {
        var _a = dynamicRoute.split(' '), _ = _a[0], routePath = _a[1];
        var routeSegments = routePath.split('/');
        var requestSegments_1 = pathname.split('/');
        var params_1 = {};
        routeSegments.forEach(function (seg, i) {
            if (seg.startsWith(':'))
                params_1[seg.substring(1)] = requestSegments_1[i];
        });
        routes[dynamicRoute](req, res, params_1, body);
    }
    else {
        (0, errorHandler_1.errorHandler)(res, 404, 'Not Found');
    }
};
exports.routeHandler = routeHandler;
