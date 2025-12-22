const router = require("express").Router();
const Product = require("../model/Product"); // matches your seed.js path

// If you already have seller auth middleware, use it here.
// For now (basic): no auth check
router.post("/add", async (req, res) => {
  try {
    const { productName, productCategory, productImage, price, qty, description } = req.body;

    const newProduct = new Product({
      productName,
      productCategory,
      productImage,
      price,
      qty,
      description,
      // sellerId: req.seller?.id  // add later if you want
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (e) {
    res.status(400).json({ message: "Failed to add product", error: e.message });
  }
});

module.exports = router;
