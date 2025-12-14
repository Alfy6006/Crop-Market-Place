require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./model/Product");
const DeliveryPost = require("./model/DeliveryPost");

const URL = process.env.MONGODB_URL;

async function run() {
  await mongoose.connect(URL);
  const items = [
    { productName: "Tomato", productCategory: "Veg", productImage: "https://images.unsplash.com/photo-1556765056-8f8b08ef188e", price: 250, stock: 120, images: [] },
    { productName: "Potato", productCategory: "Veg", productImage: "https://images.unsplash.com/photo-1544025162-d76694265947", price: 180, stock: 200, images: [] },
    { productName: "Carrot", productCategory: "Veg", productImage: "https://images.unsplash.com/photo-1547514701-42782101795c", price: 300, stock: 90, images: [] },
    { productName: "Apple", productCategory: "Fruit", productImage: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce", price: 400, stock: 80, images: [] },
    { productName: "Banana", productCategory: "Fruit", productImage: "https://images.unsplash.com/photo-1571772805064-207a7f6c5bb3", price: 200, stock: 150, images: [] },
    { productName: "Rice", productCategory: "Grain", productImage: "https://images.unsplash.com/photo-1616854374248-bbb4b77e8096", price: 220, stock: 500, images: [] },
    { productName: "Pepper", productCategory: "Spices", productImage: "https://images.unsplash.com/photo-1603732551658-3525b4f4112b", price: 1000, stock: 60, images: [] },
    { productName: "Turmeric", productCategory: "Spices", productImage: "https://images.unsplash.com/photo-1615485737651-9e1f436c6991", price: 900, stock: 40, images: [] },
  ];
  await Product.deleteMany({});
  await Product.insertMany(items);
  console.log("Seeded products", items.length);
  const vehicles = [
    { name: "D Truck 1", model: "Mahindra Bolero", capacity: 1000, vehicleImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70", price: 1500, district: "Colombo", company: "Local Movers", mobile: "0771234567", land: "0112345678", email: "dm1@example.com", address: "123 Street" },
    { name: "D Van 2", model: "Toyota HiAce", capacity: 600, vehicleImage: "https://images.unsplash.com/photo-1552519507-4b8b2560bda4", price: 1200, district: "Gampaha", company: "Swift Deliveries", mobile: "0779876543", land: "0118765432", email: "dm2@example.com", address: "456 Avenue" }
  ];
  await DeliveryPost.deleteMany({});
  await DeliveryPost.insertMany(vehicles);
  console.log("Seeded delivery partners", vehicles.length);
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
