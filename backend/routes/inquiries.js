const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const Inquiry = require("../model/Inquiry");

router.post(
  "/add",
  [
    body("senderEmail").isEmail(),
    body("receiverEmail").isEmail(),
    body("message").isString().isLength({ min: 1 }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    try {
      const { senderEmail, receiverEmail, subject, message, productId } = req.body;
      const inquiry = new Inquiry({ senderEmail, receiverEmail, subject, message, productId });
      await inquiry.save();
      res.status(201).json(inquiry);
    } catch (e) {
      next(e);
    }
  }
);

router.get("/by-receiver/:email", async (req, res, next) => {
  try {
    const data = await Inquiry.find({ receiverEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

router.get("/by-sender/:email", async (req, res, next) => {
  try {
    const data = await Inquiry.find({ senderEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
