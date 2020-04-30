const bcrypt = require("bcryptjs");
const passport = require("passport");
const Publisher = require("../models/Publisher");

exports.getLogin = (req, res) => {
  res.render("login");
};
exports.getRegister = (req, res) => {
  res.render("register");
};
exports.postLogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
};
//register

exports.postRegister = (req, res) => {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    password2,
  } = req.body;
  let errors = [];

  if (
    !firstname ||
    !lastname ||
    !username ||
    !email ||
    !password ||
    !password2
  ) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      firstname,
      lastname,
      username,
      email,
      password,
      password2,
    });
  } else {
    Publisher.findOne({ email: email }).then((publisher) => {
      if (publisher) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          //destructuring
          errors,
          firstname,
          lastname,
          username,
          email,
          password,
          password2,
        });
      } else {
        const newPublisher = new Publisher({
          //destructuring
          firstname,
          lastname,
          username,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPublisher.password, salt, (err, hash) => {
            if (err) throw err;
            newPublisher.password = hash;
            newPublisher
              .save()
              .then((publisher) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};
exports.getLogout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
};
