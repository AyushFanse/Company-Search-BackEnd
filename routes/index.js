var express = require("express");
var router = express.Router();

//~------------------------* Get User Router *------------------------~//

router.get("/", (req, res) => {
  res.render("index", { title: "Company Search" });
});

module.exports = router;
