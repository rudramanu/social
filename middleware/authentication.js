const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const blacklisted = await BlacklistModel.find();
    blacklisted.forEach((el) => {
      if (el.token == token) {
        return res.send("Your session has expired, Please login again");
      }
    });
    const decoded = jwt.verify(token, "coder");
    if (decoded) {
      console.log("dec", decoded);
      //======if you want to pass userID in every schema then use it============
      const x = decoded.userID;
      req.body.userID = x;
      //========================================================================

      //=================if you want to check authorization that who can access it then use it=============
      req.body.roleofuser = decoded.role;
      //===================================================
      next();
    } else {
      res.send("Please login first");
    }
  } else {
    res.send("Please login first");
  }
};

const authorize = (array_of_roles) => {
  return (req, res, next) => {
    const user_role = req.body.roleofuser;
    console.log(user_role);
    if (array_of_roles.includes(user_role)) {
      next();
    } else {
      res.send("Not authorized");
    }
  };
};

module.exports = {
  authenticate,
  authorize,
};
