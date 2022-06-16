const User = require("../model/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mailer = require("../middleware/Mailsender");

//*-----------------------* Registration Part *-----------------------*//

exports.user_register = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .lowercase()
      .min(6)
      .max(50)
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
      .required(),
    password: Joi.string().trim(true).required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  var existUser = await User.findOne({
    email: req.body.email.toLowerCase(),
  }).exec();
  if (existUser)
    return res
      .status(400)
      .send({ msg: "Email already exists.", status: "error" });

  const salt = await bcrypt.genSalt(10);
  const Password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: Password,
  });

  const data = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  };

  await Mailer.mailer(data);

  try {
    await user.save();
    res.status(201).send({
      msg: "You Have Successfully Registered Your Account..!",
      status: "success",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

//*-----------------------* Login Part *-----------------------*//

exports.login = async (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(4).max(15).required(),
  });

  var { error } = await schema.validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  var existUser = await User.findOne({
    email: req.body.email.toLowerCase(),
  }).exec();
  if (!existUser)
    return res
      .status(400)
      .send({ msg: "Email not reqistered", status: "error" });

  var user = {
    first_name: existUser.first_name,
    last_name: existUser.last_name,
    _id: existUser._id,
  };

  var isValid = await bcrypt.compare(req.body.password, existUser.password);
  if (!isValid)
    return res
      .status(400)
      .send({ msg: "Password doesn't match.", status: "error" });

  try {
    var token = jwt.sign({ user }, "SWERA", { expiresIn: "2h" });
    res.send({ userToken: token, status: "success" });
  } catch (err) {
    res.status(400).send(err);
  }
};
