const router = require("express").Router();
const Product = require("../model/Product");

//http://localhost:8070/product/add
router.route("/add").post((req, res) => {
  const productName = req.body.productName;
  const productCategory = req.body.productCategory;
  const productImage = req.body.productImage;
  const stock = req.body.stock;
  const images = req.body.images;
  const price = req.body.price;

  const newProduct = new Product({
    productName,
    productCategory,
    productImage,
    stock,
    images,
    price,
  });

  newProduct
    .save()
    .then(() => {
      res.json("Product added succesfully!");
    })
    .catch((error) => {
      console.log(error);
    });
});

//http://localhost:8070/product/
router.route("/").get((req, res) => {
  const { category } = req.query;
  const filter = category ? { productCategory: category } : {};
  Product.find(filter)
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to fetch products" });
    });
});

//http://localhost:8070/product/vegetable
router.route("/vegetable").get((req, res) => {
  Product.find({ productCategory: "Veg" })
    .then((products) => {
      res.json(products);
    })
    .catch((error) => {
      console.log(error);
    });
});

//http://localhost:8070/product/update/id
router.route("/update/:id").put(async (req, res) => {
  let productID = req.params.id;
  const { productName, productCategory, productImage, stock, images, price } = req.body;

  const updateProduct = { productName, productCategory, productImage, stock, images, price };

  await Product.findByIdAndUpdate(productID, updateProduct)
    .then(() => {
      res.status(200).send({ status: "Product updated" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error with updating data" });
    });
});

router.route("/adjust-stock/:id").patch(async (req, res) => {
  try {
    const productID = req.params.id;
    const { delta } = req.body;
    const product = await Product.findById(productID);
    if (!product) return res.status(404).json({ error: "Product not found" });
    const newStock = Math.max(0, (product.stock || 0) + Number(delta || 0));
    product.stock = newStock;
    await product.save();
    res.json({ stock: product.stock });
  } catch (e) {
    res.status(500).json({ error: "Failed to adjust stock" });
  }
});

//http://localhost:8070/product/delete/id
router.route("/delete/:id").delete(async (req, res) => {
  let productID = req.params.id;

  await Product.findByIdAndDelete(productID)
    .then(() => {
      res.status(200).send({ status: "Product deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "Error with updating data" });
    });
});

//http://localhost:8070/student/get/id
router.route("/get/:id").get(async (req, res) => {
  let productID = req.params.id;
  await Product.findById(productID)
    .then((product) => {
      res.status(200).send({ status: "user fetched", product });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send({ status: "error with ferching student" });
    });
});

// Backend (Express.js)
router.route("/:category").get(async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ productCategory: category });
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "Error fetching products" });
  }
});

module.exports = router;
