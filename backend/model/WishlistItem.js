const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wishlistItemSchema = new Schema({
  userEmail: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WishlistItem", wishlistItemSchema);
