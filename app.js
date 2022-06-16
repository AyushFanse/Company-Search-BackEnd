var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var mongo = require("./middleWare/connection");
var usersRouter = require("./routes/users");
var companyRouter = require("./routes/company");
var registerRouter = require("./routes/register");
var indexRouter = require("./routes/index");
var cors = require("cors");
const dotenv = require("dotenv");
var app = express();

//^--------------------------* DB CONNECTIONS *--------------------------^//

mongo.connect();
dotenv.config();

//^--------------------------* VIEW ENGIN *--------------------------^//

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

//&--------------------------* ROUTERS *--------------------------&//

app.use("/", indexRouter);
app.use("/operator", usersRouter);
app.use("/company", companyRouter);
app.use("/register", registerRouter);

//!------------------* ERRORS HANDLER *------------------!//

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

//*--------------------------* POORT *--------------------------*//

var port = process.env.PORT || "3001";
app.set("port", port);
app.listen(port, () =>
  console.log(`Server is stated on http://localhost:${port}`)
);

module.exports = app;
