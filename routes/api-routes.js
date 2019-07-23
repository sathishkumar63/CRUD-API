const express = require("express");
const router = express.Router();
const signupController = require("../controllers/signupController");
const logoutController = require("../controllers/logout");

// Set default API response
router.get("/api-status", function(req, res) {
  res.json({
    message: "API Its Working",
    status: "true"
  });
});

// Signup routes
router.post("/signUp", signupController.createUser);
router.get("/signup/checkEmail/:emailId", signupController.emailCheck);
router.get("/signup/checkPhone/:phoneNumber", signupController.phoneCheck);
router.post("/login", signupController.login);
router.post("/logout", logoutController.logout);
// Export API routes
module.exports = router;
