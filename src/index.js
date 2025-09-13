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
var hono_1 = require("hono");
var cors_1 = require("hono/cors");
var home_1 = require("./pages/home");
var layout_1 = require("./layouts/layout");
var app = new hono_1.Hono();
app.use('*', (0, cors_1.cors)());
// Routes
app.get('/', function (c) {
    var html = (0, home_1.renderHomePage)();
    return c.html(html);
});
app.get('/about', function (c) {
    var content = "<div class=\"container mx-auto px-4 py-20\">\n    <h1 class=\"text-4xl font-bold mb-8\">About MobiCycle USA</h1>\n    <p class=\"text-lg\">We help organizations manage their Scope 3 emissions from electronics and electricals.</p>\n  </div>";
    var html = (0, layout_1.renderLayout)('MobiCycle USA | About', content);
    return c.html(html);
});
app.get('/services', function (c) {
    var content = "<div class=\"container mx-auto px-4 py-20\">\n    <h1 class=\"text-4xl font-bold mb-8\">Our Services</h1>\n    <p class=\"text-lg\">Comprehensive Scope 3 emissions management for your organization.</p>\n  </div>";
    var html = (0, layout_1.renderLayout)('MobiCycle USA | Services', content);
    return c.html(html);
});
app.get('/contact', function (c) {
    var content = "<div class=\"container mx-auto px-4 py-20\">\n    <h1 class=\"text-4xl font-bold mb-8\">Contact Us</h1>\n    <p class=\"text-lg\">Get in touch to learn more about our services.</p>\n    <p class=\"mt-4\">Email: info@mobicycle-usa.com</p>\n  </div>";
    var html = (0, layout_1.renderLayout)('MobiCycle USA | Contact', content);
    return c.html(html);
});
// Newsletter signup endpoint
app.post('/api/newsletter', function (c) { return __awaiter(void 0, void 0, void 0, function () {
    var formData, email, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, c.req.formData()];
            case 1:
                formData = _a.sent();
                email = formData.get('email');
                return [4 /*yield*/, fetch('https://signups.mobicycle.workers.dev/', {
                        method: 'POST',
                        body: formData
                    })];
            case 2:
                response = _a.sent();
                if (response.ok) {
                    return [2 /*return*/, c.redirect('/?success=true')];
                }
                else {
                    return [2 /*return*/, c.redirect('/?error=true')];
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/api/health', function (c) {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// 404 handler
app.notFound(function (c) {
    var content = "<div class=\"container mx-auto px-4 py-20 text-center\">\n    <h1 class=\"text-6xl font-bold mb-4\">404</h1>\n    <p class=\"text-xl mb-8\">Page not found</p>\n    <a href=\"/\" class=\"text-purple-400 hover:underline\">Return to home</a>\n  </div>";
    var html = (0, layout_1.renderLayout)('MobiCycle USA | Page Not Found', content);
    return c.html(html, 404);
});
exports.default = app;
