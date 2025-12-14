const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const WishlistItem = require("../model/WishlistItem");

router.post(
  "/add",
  [
    body("userEmail").isEmail(),
    body("productId").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { userEmail, productId } = req.body;
    try {
      const item = new WishlistItem({ userEmail, productId });
      await item.save();
      res.status(201).json(item);
    } catch (e) {
      res.status(500).json({ error: "Failed" });
    }
  }
);

router.get("/:userEmail", async (req, res) => {
  try {
    const items = await WishlistItem.find({ userEmail: req.params.userEmail }).populate("productId");
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await WishlistItem.findByIdAndDelete(req.params.id);
    res.json({ status: "deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
