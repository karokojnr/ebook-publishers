const express = require("express");
const path = require("path");
const app = express();
const Ebook = require("../models/Ebook");
const crypto = require("crypto");

const authController = require("../controllers/authController");
const homeController = require("../controllers/homeController");
const ebookController = require("../controllers/ebookController");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const { isEmpty, uploadDir } = require("../helpers/upload-helper");

let errors = [];
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "karokojnr",
  api_key: "346784416385434",
  api_secret: "oinDoqFA3NRMY66lPMV-M5NOCgQ",
});

const multer = require("multer");
const storage = multer.diskStorage({
  destination: "public/images/uploads/ebooks",
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err);

      cb(null, raw.toString("hex") + path.extname(file.originalname));
    });
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".pdf") {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  // fileFilter: fileFilter,
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

app.post(
  "/add-ebook",
  ensureAuthenticated,
  // upload.fields([
  //   { name: "ebookfile", maxCount: 1 },
  //   { name: "ebookcover", maxCount: 1 },
  // ]),
  (req, res) => {
    let filename = "";
    if (!isEmpty(req.files)) {
      let file = req.files.file;
      filename = Date.now() + "-" + file.name;
    }
    cloudinary.uploader.upload(
      req.file.tempFilePath,
      (err, resultDoc) => {
        if (err) return err;
        let ebook = new Ebook(req.body);
        const name = req.user.firstname;
        ebook.ebookfile = resultDocurl;
        ebook.publisherId = `${req.user._id}`;
        ebook.publisher = name;
        if (!req.body) {
          errors.push({ msg: "Please enter all fields" });
        }

        ebook
          .save()
          .then((savedEbook) => {
            if (!ebook) {
              res.render("add-ebook", {
                errors,
                failureFlash: true,
              });
            }
            req.flash("success_msg", "eBook saved");
            res.redirect("/");
          })
          .catch((err) => {
            throw err;
          });
      }
    );
  }
);

module.exports = app;
