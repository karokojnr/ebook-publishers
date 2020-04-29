exports.getAddEbook = (req, res) => {
  res.render("add-ebook", {
    name: req.user.firstname,
    fullname: req.user.firstname + " " + "" + req.user.lastname,

  });
};
