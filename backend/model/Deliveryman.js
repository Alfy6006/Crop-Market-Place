const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliverymanSchema = new Schema({
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

  vehicleNumber: {
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

module.exports = mongoose.model("deliveryman", deliverymanSchema);
