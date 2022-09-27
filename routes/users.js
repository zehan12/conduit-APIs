var express = require('express');
var router = express.Router();
var usersController = require("../controllers/usersController");
var auth = require("../middlewares/auth")


router.post( "/register",usersController.register );

router.post( "/login", usersController.login );

router.get( "/all", usersController.allUsers );

module.exports = router;
