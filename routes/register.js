const express = require("express");
const router = express.Router();
const Register = require("../modules/registerModule");

//~------------------------* Create Contacts Router *------------------------~//

router.post("/user", Register.user_register);

//~------------------------* Login Router *------------------------~//

router.post("/login", Register.login);

module.exports = router;
