const User = require("../models/signupModel"); // Import signup model

// On Logout
exports.logout = (request, response, next) => {
  console.log("user details:", request.body);
  User.findById(request.body._id, function(err, user) {
    if (err) response.status(500).json(err);
    user.isLoggedIn = false;
    // save the user and check for errors
    user.save(function(err) {
      if (err) response.status(500).json(err);
      response.status(201).json({
        message: "User logout successfully",
        status: "true"
      });
    });
  });
};
