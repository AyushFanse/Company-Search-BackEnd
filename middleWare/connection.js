const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//*---------------------------* Mongoose Connection *---------------------------*//

exports.connect = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    alert("Error connecting to Server");
    process.exit();
  }
};
