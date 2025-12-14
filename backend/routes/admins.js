const router = require("express").Router();
const Admin = require("../model/Admin");
const Farmer = require("../model/Farmer");
const Seller = require("../model/Seller");
const Deliveryman = require("../model/Deliveryman");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Admin login route
// http://localhost:8070/admin/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ error: "Invalid credentials!" });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);
        if (isPasswordMatch) {
            const token = jwt.sign({ email: admin.email, role: "admin" }, JWT_SECRET);
            return res.status(200).json({ status: "ok", data: token });
        } else {
            return res.status(401).json({ status: "error", error: "Invalid Password" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: "error", error: "An error occurred during login" });
    }
});

// Get admin data from token
// http://localhost:8070/admin/userdata
router.post("/userdata", async (req, res) => {
    const { token } = req.body;

    try {
        const admin = jwt.verify(token, JWT_SECRET);
        const adminEmail = admin.email;
        const data = await Admin.findOne({ email: adminEmail });
        res.send({ status: "ok", data: data });
    } catch (error) {
        console.error(error);
        res.send({ status: "error", data: error });
    }
});

// Get all pending users (not approved)
// http://localhost:8070/admin/pending-users
router.get("/pending-users", async (req, res) => {
    try {
        const pendingFarmers = await Farmer.find({ isApproved: false }).select("-password");
        const pendingSellers = await Seller.find({ isApproved: false }).select("-password");
        const pendingDeliverymen = await Deliveryman.find({ isApproved: false }).select("-password");

        const pendingUsers = [
            ...pendingFarmers.map(user => ({ ...user.toObject(), role: "Farmer" })),
            ...pendingSellers.map(user => ({ ...user.toObject(), role: "Seller" })),
            ...pendingDeliverymen.map(user => ({ ...user.toObject(), role: "Deliveryman" }))
        ];

        res.status(200).json({ status: "ok", data: pendingUsers });
    } catch (error) {
        console.error("Error fetching pending users:", error);
        res.status(500).json({ error: "Server error. Failed to fetch pending users." });
    }
});

// Get all approved users
// http://localhost:8070/admin/approved-users
router.get("/approved-users", async (req, res) => {
    try {
        const approvedFarmers = await Farmer.find({ isApproved: true }).select("-password");
        const approvedSellers = await Seller.find({ isApproved: true }).select("-password");
        const approvedDeliverymen = await Deliveryman.find({ isApproved: true }).select("-password");

        const approvedUsers = [
            ...approvedFarmers.map(user => ({ ...user.toObject(), role: "Farmer" })),
            ...approvedSellers.map(user => ({ ...user.toObject(), role: "Seller" })),
            ...approvedDeliverymen.map(user => ({ ...user.toObject(), role: "Deliveryman" }))
        ];

        res.status(200).json({ status: "ok", data: approvedUsers });
    } catch (error) {
        console.error("Error fetching approved users:", error);
        res.status(500).json({ error: "Server error. Failed to fetch approved users." });
    }
});

// Approve a user
// http://localhost:8070/admin/approve/:role/:id
router.put("/approve/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        let Model;

        switch (role) {
            case "Farmer":
                Model = Farmer;
                break;
            case "Seller":
                Model = Seller;
                break;
            case "Deliveryman":
                Model = Deliveryman;
                break;
            default:
                return res.status(400).json({ error: "Invalid role" });
        }

        const user = await Model.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: "ok",
            message: `${role} approved successfully`,
            data: user
        });
    } catch (error) {
        console.error("Error approving user:", error);
        res.status(500).json({ error: "Server error. Failed to approve user." });
    }
});

// Reject/Delete a pending user
// http://localhost:8070/admin/reject/:role/:id
router.delete("/reject/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        let Model;

        switch (role) {
            case "Farmer":
                Model = Farmer;
                break;
            case "Seller":
                Model = Seller;
                break;
            case "Deliveryman":
                Model = Deliveryman;
                break;
            default:
                return res.status(400).json({ error: "Invalid role" });
        }

        const user = await Model.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            status: "ok",
            message: `${role} rejected and removed successfully`
        });
    } catch (error) {
        console.error("Error rejecting user:", error);
        res.status(500).json({ error: "Server error. Failed to reject user." });
    }
});

module.exports = router;
