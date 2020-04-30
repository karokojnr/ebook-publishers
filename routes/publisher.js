const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const Ebook = require("../models/Ebook");

var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const ebookController = require("../controllers/ebookController");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "karokojnr",
  api_key: "346784416385434",
  api_secret: "oinDoqFA3NRMY66lPMV-M5NOCgQ",
});

app.get("/allebooks", ensureAuthenticated, homeController.getAllEbooks);
app.get("/ebook/:id", ensureAuthenticated, homeController.getEbook);

app.get("/", ensureAuthenticated, homeController.getHome);
app.get("/login", forwardAuthenticated, authController.getLogin);
app.get("/register", forwardAuthenticated, authController.getRegister);
app.get("/add-ebook", ensureAuthenticated, ebookController.getAddEbook);
app.get(
  "/publisher-ebooks",
  ensureAuthenticated,
  homeController.getPublisherEbooks
);
app.get("/logout", authController.getLogout);
app.post("/login", authController.postLogin);
app.post("/register", authController.postRegister);

app.post("/add-ebook", ensureAuthenticated, multipartMiddleware, (req, res) => {
  const name = req.user.firstname;
  const docPdf = req.files.ebookfile.path;
  cloudinary.uploader
    .upload(docPdf)
    .then((uploadDoc) => {
      const newEbook = new Ebook({
        title: req.body.title,
        ebookcover: req.body.ebookcover,
        ebookfile: uploadDoc.url,
        description: req.body.description,
        publisherId: req.user._id,
        publisher: name,
      });
      newEbook.save().then((ebook) => {
        if (!ebook) {
          res.render("add-ebook", {
            errors,
            failureFlash: true,
          });
        }
        req.flash("success_msg", "eBook saved");
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("failure_msg", "eBook not saved!");
      res.redirect("/");
      throw err;
    });
});

module.exports = app;
