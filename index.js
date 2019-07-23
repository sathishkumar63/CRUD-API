const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const apiroutes = require("./routes/api-routes"); // Import routes
const config = require("./config.json");
const expressJwt = require("express-jwt");
const app = express(); // Initialize the app
const port = process.env.PORT || 3000; // Setup server port
const uri = config.connectionString; //mongoDB connection string

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.options("*", cors());

mongoose
  .connect(uri, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, function() {
      console.log(`Node server listening on port ${port}`);
    });
    console.log("Successfully connected to the database");
  })
  .catch(err => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

// Send message for default URL
app.get("/", (req, res, next) =>
  res.json({ tutorial: "Build REST API with node.js and Express" })
);

// Use Api routes in the App
app.use("/nrfsi/nissan/dlp/customer", apiroutes); //using routes specified externally

// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(
  expressJwt({
    secret: config.secret,
    getToken: function(req) {
      console.log(req);
      if (req.headers.Authorization && req.headers.Authorization.split(" ")[0] === "Bearer") {
        return req.headers.Authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }
      return null;
    }
  }).unless({
    path: [
      // public routes that don't require authentication
      "/",
      "/signUp",
      "/signup/checkEmail/:emailId",
      "/signup/checkPhone/:phoneNumber",
      "/login"
    ]
  })
);

// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function(req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use(function(err, req, res, next) {
  console.log(err);
  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else if (err.name === "UnauthorizedError")
    res.status(401).json({ message: "No access token was found" });
  else res.status(500).json({ message: "Something looks wrong :( !!!" });
});
