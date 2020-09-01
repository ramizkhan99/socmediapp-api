"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var userController_1 = require("./controllers/userController");
var router = express_1.Router();
// User routes
router.post("/user/new", userController_1.userController.create);
router.post("/user/login", userController_1.userController.login);
exports.default = router;
