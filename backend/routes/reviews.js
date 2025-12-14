const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const Review = require("../model/Review");

router.post(
  "/add",
  [
    body("productId").isString(),
    body("userEmail").isEmail(),
    body("rating").isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { productId, userEmail, rating, comment } = req.body;
    try {
      const review = new Review({ productId, userEmail, rating, comment });
      await review.save();
      res.status(201).json(review);
    } catch (e) {
      res.status(500).json({ error: "Failed" });
    }
  }
);

router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

router.get("/product/:productId/summary", async (req, res) => {
  try {
    const productId = req.params.productId;
    const agg = await Review.aggregate([
      { $match: { productId: new (require("mongoose").Types.ObjectId)(productId) } },
      { $group: { _id: "$productId", avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);
    const summary = agg[0] || { avg: 0, count: 0 };
    res.json(summary);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
