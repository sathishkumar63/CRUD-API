const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config.json");
const User = require("../models/signupModel"); // Import signup model

// Email id check
exports.emailCheck = (request, response, next) => {
  const email = request.params.emailId;
  console.log("emailID:", email);
  User.findOne({ emailId: email }, function(error, user) {
    if (error) return next(error);
    return user
      ? response.status(409).json({ message: "User with email already found" })
      : response.status(201).json({ message: "Email is valid." });
  });
};

// Phone number check
exports.phoneCheck = (request, response, next) => {
  const phone = request.params.phoneNumber;
  console.log("phoneNo:", phone);
  User.findOne({ phoneNo: phone }, function(error, user) {
    if (error) return next(error);
    return user
      ? response.status(409).json({ message: "User with phone already found" })
      : response.status(201).json({ message: "Phone number is valid." });
  });
};

// Create and Save a new User
exports.createUser = (request, response, next) => {
  // Validate request
  if (
    !request.body.firstName ||
    !request.body.lastName ||
    !request.body.phoneNo ||
    !request.body.emailId ||
    !request.body.password
  ) {
    return response.status(400).send({
      status: "false",
      message: "All fields are required"
    });
  }
  const password = bcrypt.hashSync(
    request.body.password,
    bcrypt.genSaltSync(10)
  );
  // Create a new User
  const addUser = new User({
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    emailId: request.body.emailId,
    phoneNo: request.body.phoneNo,
    password: password
  });
  // Save user in the database
  addUser.save(function(err) {
    if (err) response.json(err);
    response.status(201).json({
      message: "New user added successfully!",
      status: "true"
    });
  });
};

// On Login
exports.login = (request, response, next) => {
  // Validate request
  if (!request.body.user || !request.body.password) {
    return response.status(400).send({
      status: "false",
      message: "All fields are required"
    });
  }
  User.findOne(
    { $or: [{ emailId: request.body.user }, { phoneNo: request.body.user }] },
    "_id firstName lastName password emailId phoneNo isLoggedIn",
    function(error, person) {
      if (error) return next(error);
      if (!person)
        return response
          .status(400)
          .json({ message: "Incorrect email or mobile." });
      const validPassword = bcrypt.compareSync(
        request.body.password,
        person.password
      );
      if (!validPassword)
        return response.status(400).json({ message: "Incorrect password." });
      person.isLoggedIn = true;
      person.save(function(err) {
        if (err) throw err;
        console.log("User updated successfully");
      });
      const expiresIn = 24 * 60 * 60;
      const accessToken = jwt.sign({ id: person.id }, config.secret, {
        expiresIn: expiresIn
      });
      person = person.toObject();
      delete person.password;
      delete person.isLoggedIn;
      response.status(201).json({
        status: "true",
        message: "Logged in successfully",
        token: accessToken,
        person
      });
    }
  );
};
