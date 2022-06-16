const User = require("../model/User");

//*---------------------------* Get All Users From DataBase *---------------------------*//

exports.getUser = async (req, res, next) => {
  try {
    await User.find();
    res.status(200);
  } catch (err) {
    res.status(400).send(err);
  }
};

//*---------------------------* Get User By ID From DataBase *---------------------------*//

exports.getUserById = async (req, res, next) => {
  try {
    const post = await User.findById(req.params.userId);
    res.status(200).send(post);
  } catch (err) {
    res.status(400).send(err);
  }
};

//*---------------------------* Delete User By Id *---------------------------*//

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndRemove(req.params.userId);
    res
      .status(200)
      .json({
        msg: "You have successfully deleted your account..!",
        status: "success",
      });
  } catch (err) {
    res.status(400).send(err);
  }
};
