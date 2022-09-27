var express = require('express');
var router = express.Router();
var userController = require("../controllers/userController");
var auth = require("../middlewares/auth")

router.get( '/', auth.verifyToken, userController.currentUser );

router.put( '/', auth.verifyToken, userController.updateUser );

module.exports = router;
