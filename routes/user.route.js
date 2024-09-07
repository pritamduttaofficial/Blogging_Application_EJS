const express = require("express");
const User = require("../models/user.model");
const { createUserToken } = require("../utils/authentication");

const router = express.Router();

// redirects to `signup` page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// retrieves `signup` form data from body of `post` request
router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName: fullName,
    email: email,
    password: password,
  });
  return res.redirect("/");
});

// redirects to `login` page
router.get("/login", (req, res) => {
  res.render("login");
});

// retrieves `login` form data from body of `post` request
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.matchPassword(email, password);
    const userToken = createUserToken(user);
    return res.cookie("token", userToken).redirect("/");
  } catch (error) {
    return res.render("login", {
      error: "Incorrect Email or Password",
    });
  }
});

// logout
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
