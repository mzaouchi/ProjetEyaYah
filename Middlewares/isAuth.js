var jwt = require("jsonwebtoken");
const User = require("../Models/User");

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res
        .status(401)
        .send({ errors: [{ msg: "Not authorized, no token" }] });
    }
    const cleanToken = token.startsWith("Bearer ")
      ? token.slice(7, token.length)
      : token;

    var decoded = jwt.verify(cleanToken, process.env.privateKey || "secretKey");

    if (!decoded) {
      return res.status(400).send({ errors: [{ msg: "Wrong token" }] });
    }

    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).send({ errors: [{ msg: "User not found" }] });
    }
    req.user = user;

    next();
  } catch (error) {
    res
      .status(500)
      .send({ errors: [{ msg: "Not authorized", error: error.message }] });
  }
};
