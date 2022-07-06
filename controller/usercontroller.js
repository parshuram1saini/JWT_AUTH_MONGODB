import UserModal from "../model/userModal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

class Usercontroller {
  //signup method
  static Useregistration = async (req, res) => {
    let info = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    };
    const user = await UserModal.findOne({ email: info.email });
    // console.log(user);
    if (user) {
      res.status(400).send({
        status: 0,
        message: "email is already exists",
      });
      return;
    } else {
      if (
        info.username &&
        info.email &&
        info.password &&
        info.confirmPassword
      ) {
        if (info.password === info.confirmPassword) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(info.password, salt);
            // res.send(hashpassword);
            let userDocs = new UserModal({
              username: info.username,
              email: info.email,
              password: hashpassword,
            });
            userDocs = await userDocs.save();
            // console.log(userDocs);
            const savedUser = await UserModal.findOne({ email: info.email });
            ///-----GENERATE JWT TOKEN-----///
            const token = jwt.sign(
              { userID: savedUser._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            // console.log(token)
            res.status(201).json({
              status: 1,
              message: "successful registrated",
              token: token,
            });
          } catch (error) {
            console.log(error);
            res.status(400).json({
              status: 0,
              message: "unable to register",
            });
          }
        } else {
          res.status(400).json({
            status: 0,
            message: "Password doesn't match",
          });
        }
      } else {
        res.status(400).send({
          status: 0,
          message: "All field are required",
        });
      }
    }
  };
  //login method
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!(email && password)) {
        res
          .status(400)
          .json({ status: 0, message: "Email & Password are mandatory" });
      } else if (email && password) {
        const user = await UserModal.findOne({ email: email });
        if (user != null) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            const token = jwt.sign(
              { userID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1d" }
            );
            return res.status(201).json({
              status: 1,
              message: "Your Logged succesfully",
              token: token,
            });
          } else
            return res
              .status(400)
              .send({ message: "email or password isn't match" });
        }
      } else {
        res.status(400).json({
          status: 0,
          message: "you are not a register User",
        });
      }
    } catch (error) {
      res.status(400).send({ message: "something is not found" });
    }
  };
  static changePassword = async (req, res) => {
    // console.log(req.body)
    const { password, confirmPassword } = req.body;

    if (password && confirmPassword) {
      if (password != confirmPassword) {
        res.status(400).send({ status: 0, message: "password doesn't match" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        await UserModal.findByIdAndUpdate(req.user._id, {
          $set: { password: hashpassword },
        });
        res
          .status(201)
          .send({ status: 1, message: "password change succesfully" });
      }
    } else
      return res
        .status(400)
        .send({ status: 0, message: "All field are required" });
  };
  static loggedUserData = async (req, res) => {
    res.status(201).json({ status: 1, user: req.user });
  };
  static sendUserPasswordEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await UserModal.findOne({ email: email });
      if (user) {
        const token = jwt.sign(
          { userID: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "45m",
          }
        );
        ///-----frontend link for submit after filling email----//
        const link = `https://localhost:27.0.0.1/api/user/reset/${user._id}/${token}`;
        console.log(link);
        ///--------------------------------//
        //----EMAIL DETAILS----//
        let info_email = await transporter.sendMail({
               from:process.env.EMAIL_FROM,
               to:user.email,
              subject: "PR SAINI ---- TO reset password link",
               html:`<a href=${link}>Click here</a> To reset your Password`
         })
        return res.status(400).send({
          status: 1,
          message: "Password reset Email Sent... Please Check Your Email",
          "info_email":info_email
        });
      } else
        return res
          .status(400)
          .send({ status: 0, message: "Email doesn't exists" });
    } else
      return res.status(400).send({ status: 0, message: "Email are required" });
  };
  static userPasswordReset = async (req, res) => {
    const { password, confirmPassword } = req.body;
    console.log(password, confirmPassword)
    const { id, token } = req.params;
    const user = await UserModal.findById(id);
    console.log(user)
    try {
     const bal= jwt.verify(token, process.env.JWT_SECRET_KEY);
    //  console.log(bal)
      if (password && confirmPassword) {
        if (password !== confirmPassword) {
          return res
            .status(400)
            .send({ status: 0, message: "Password doesn't match" });
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashpassword = await bcrypt.hash(password, salt);
          await UserModal.findByIdAndUpdate(user._id, {
            $set: { password: hashpassword },
          });
          return res
            .status(201)
            .send({ status: 1, message: "password Reset succesfully" });
        }
      }
      else{
        res
          .status(400)
          .send({ status: 0, message: "password is required" });
      }
    } catch (error) {
      res
        .status(400)
        .send({ status: 0, message: "invalid token or time limit excceded" });
    }
  };
}
export default Usercontroller;
