import express  from "express";
const router = express.Router(); // router() function inside the express 
import Usercontroller from "../controller/usercontroller.js";
import checkUserAuth from "../middleware/auth_middleware.js"

//Routes level middleware - to protect routes--//
router.post("/changepassword",checkUserAuth)
router.post("/loggeduser",checkUserAuth)
//public routes ----//
router.post("/register",Usercontroller.Useregistration)
router.post("/login",Usercontroller.userLogin)
///sending the link of user email1
router.post("/send-user-password-email",Usercontroller.sendUserPasswordEmail)
router.post("/reset-password/:id/:token",Usercontroller.userPasswordReset)

//protected routes ----// 
router.post("/changepassword",Usercontroller.changePassword)
router.post("/loggeduser",Usercontroller.loggedUserData)

export default router;