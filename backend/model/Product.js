const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productName: {
    type: String,
    require: true,
  },

  productCategory: {
    type: String,
    require: true,
  },

  productImage: {
    type: String, // Assuming you want to store the image URL as a string
    required: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("Product", productSchema);
