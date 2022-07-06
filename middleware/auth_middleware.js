import UserModal from "../model/userModal.js";
import JWT from "jsonwebtoken";

const checkUserAuth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  // token = authorization.slice(7);
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      //get token from headers
      token = authorization.split(" ")[1];
      console.log(token);
      ///----verify token----///
      const { userID } = JWT.verify(token, process.env.JWT_SECRET_KEY);
      console.log(userID);
      // --get user from token with out ---//
      req.user = await UserModal.findById(userID).select("-password");
      next();
    } catch (error) {
      console.log(error.message);
      return res.status(401).json({ status: 0, message: "Unauthorized user" });
    }
  } else if (!token) {
    return res
      .status(401)
      .json({ status: 0, message: "Unauthorized user, No token" });
  }
};
export default checkUserAuth;
