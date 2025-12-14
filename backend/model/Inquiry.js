const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  subject: { type: String, default: "" },
  message: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inquiry", inquirySchema);
