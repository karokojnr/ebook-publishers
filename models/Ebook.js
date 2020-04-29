const mongoose = require("mongoose");
const EbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ebookcover: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2013/07/13/13/42/tux-161439__340.png",
      // required: true,
    },
    file: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
    },
    publisher: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Ebook", EbookSchema);
