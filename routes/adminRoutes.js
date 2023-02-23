const express = require('express');
const adminRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminController = require('../controllers/admin/adminController');

adminRouter.route("/getUsers").get(authMiddleware.auth,authMiddleware.restrictTo(2),adminController.getUsers);

module.exports = adminRouter;