const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const warpAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignup)//signup form route
.post(warpAsync(userController.signupUser));//signup rout

router
.route("/login")
.get(userController.renderLogin)//login form route
.post(
    saveRedirectUrl,
    passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), 
    userController.loginUser);//login route

//logout rout
router.get("/logout", userController.logoutUser);

module.exports = router;