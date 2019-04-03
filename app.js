var express = require('express');
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var User = require("./models/user");
var LocalStrategy = require("passport-local");
var app = require("express")();
const path = require("path");

mongoose.connect(`mongodb://localhost:27017/UserAuthentication`, {
  useMongoClient: true
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(
  require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
  })
);

app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");
//
app.use(passport.initialize());
app.use(passport.session());
//
// passport.use(new LocalStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

// Auth Routes

app.get("/register", function (req, res) {
  res.render("register");
});
//handling user sign up
app.post("/register", function (req, res) {
  User.register(
    new User({
      username: req.body.username
    }),
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        return res.render("register");
      }
      passport.authenticate("local")(req, res, function (req, res) {
        res.redirect("/secret"); //once the user sign up
      });
    }
  );
});

// Login Routes
app.get("/login", function (req, res) {
  res.render("login");
});

// middleware
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
  }),
  function (req, res) {
    res.send("User is " + req.user.id);
  }
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

var listener = app.listen(8888, function () {
  app.listen(process.env.PORT, process.env.IP, function () {
    console.log("connect!");
  });
});