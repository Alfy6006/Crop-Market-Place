const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
  userRole: {
    type: String,
  },

  fname: {
    type: String,
  },

  lname: {
    type: String,
  },

  email: {
    type: String,
  },
  district: {
    type: String,
  },
  password: {
    type: String,
  },

  shopName: {
    type: String,
  },

  primaryKey: {
    type: String,
    unique: true,
  },

  isApproved: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Seller", sellerSchema);
