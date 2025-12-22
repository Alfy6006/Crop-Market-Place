const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require("dotenv").config();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const winston = require("winston");

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(helmet());
const logger = winston.createLogger({
  level: "info",
  transports: [new winston.transports.Console({ format: winston.format.json() })],
});
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(xss());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const URL = process.env.MONGODB_URL;
mongoose.connect(URL);

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection success!");
});

const productRouter = require("./routes/products");
app.use("/product", productRouter); //http://localhost:8070/student

const farmerRouter = require("./routes/farmers");
app.use("/farmer", farmerRouter); //http://localhost:8070/farmer

const sellerRouter = require("./routes/sellers");
app.use("/seller", sellerRouter); //http://localhost:8070/seller

const sellerOrderRouter = require("./routes/sellerOrders");
app.use("/sellerorder", sellerOrderRouter); //http://localhost:8070/sellerorder

const farmerOrderRouter = require("./routes/farmerOrders");
app.use("/farmerorder", farmerOrderRouter); //http://localhost:8070/sellerorder

const deliveryPostRouter = require("./routes/deliveryposts");
app.use("/deliverypost", deliveryPostRouter); //http://localhost:8070/sellerorder

const deliverymanRouter = require("./routes/deliverymen");
app.use("/deliveryman", deliverymanRouter); //http://localhost:8070/both

const wishlistRouter = require("./routes/wishlist");
app.use("/wishlist", wishlistRouter);

const reviewRouter = require("./routes/reviews");
app.use("/review", reviewRouter);

const inquiryRouter = require("./routes/inquiries");
app.use("/inquiry", inquiryRouter);

const sellerProducts = require("./routes/sellerProducts");
app.use("/seller/products", sellerProducts);

const adminRouter = require("./routes/admins");
app.use("/admin", adminRouter); //http://localhost:8070/admin

const checkoutAddressRouter = require("./routes/checkoutAddress");
app.use("/checkout-address", checkoutAddressRouter); //http://localhost:8070/checkout-address

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  logger.error(err.message || "Unknown error", { stack: err.stack });
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
