var express = require("express");
var router = express.Router();
var User = require("../modules/userModule");

//~------------------------* Get User Router *------------------------~//

router.get("/getusers", User.getUser);

//~------------------------* Get User Router *------------------------~//

router.get("/getuser/:userId", User.getUserById);

//~------------------------* Delete User Router *------------------------~//

router.delete("/deleteuser/:userId", User.deleteUser);

module.exports = router;
