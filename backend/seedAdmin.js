const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./model/Admin");

const URL = process.env.MONGODB_URL;

mongoose.connect(URL)
    .then(async () => {
        console.log("MongoDB connection success!");

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: "admin@agrimarket.com" });

        if (existingAdmin) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);

        const admin = new Admin({
            name: "Admin",
            email: "admin@agrimarket.com",
            password: hashedPassword
        });

        await admin.save();
        console.log("Admin user created successfully!");
        console.log("Email: admin@agrimarket.com");
        console.log("Password: admin123");
       

        process.exit(0);
    })
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
