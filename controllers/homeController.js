const Ebook = require("../models/Ebook");

exports.getAllEbooks = (req, res) => {
  Ebook.find()
    .then((ebooks) => {
      const ebooksAllNumber = ebooks.length;
      res.render("dashboard", {
        //user accessed after login
        name: req.user.firstname,
        fullname: req.user.firstname + " " + "" + req.user.lastname,
        ebooks: ebooks,
        pageTitle: "Publisher eBooks",
        ebooksAllNumber: ebooksAllNumber,
      });
    })
    .catch((err) => {
      throw err;
    });
};
exports.getHome = async (req, res) => {
  const allEbooks = await Ebook.find();
  const ebooksAllNumber = allEbooks.length;

  Ebook.find({ publisherId: req.user._id })
    .then((ebooks) => {
      const ebooksNumber = ebooks.length;
      res.render("dashboard", {
        //user accessed after login
        name: req.user.firstname,
        fullname: req.user.firstname + " " + "" + req.user.lastname,
        ebooks: ebooks,
        pageTitle: "Publisher eBooks",
        ebooksNumber: ebooksNumber,
        ebooksAllNumber: ebooksAllNumber,
      });
    })
    .catch((err) => {
      throw err;
    });
};
exports.getPublisherEbooks = (req, res) => {
  Ebook.find({ publisherId: req.user._id })
    .then((ebooks) => {
      res.render("ebooks", {
        ebooks: ebooks,
        pageTitle: "Publisher eBooks",
        name: req.user.firstname,
        fullname: req.user.firstname + " " + "" + req.user.lastname,
      });
    })
    .catch((err) => {
      throw err;
    });
};
exports.getEbook = (req, res) => {
  const ebookId = req.params.id;
  Ebook.findById(ebookId)
    .then((ebook) => {
      const ebookPath = ebook.ebookfile;
      res.render("ebook", {
        ebook: ebookPath,
        name: req.user.firstname,
        fullname: req.user.firstname + " " + "" + req.user.lastname,
      });
    })
    .catch((err) => {
      throw err;
    });
};
