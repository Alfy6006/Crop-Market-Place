const router = require("express").Router();
const CheckoutAddress = require("../model/CheckoutAddress");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;


const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace("Bearer ", "") || req.body.token;

        if (!token) {
            return res.status(401).json({ error: "Authentication required" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Save new address or update existing
// POST /checkout-address/save
router.post(
    "/save",
    authenticateUser,
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("phone").notEmpty().withMessage("Phone is required"),
        body("address1").notEmpty().withMessage("Address line 1 is required"),
        body("city").notEmpty().withMessage("City is required"),
        body("state").notEmpty().withMessage("State is required"),
        body("pincode").notEmpty().withMessage("Pincode is required"),
        body("country").notEmpty().withMessage("Country is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { fullName, phone, address1, address2, city, state, pincode, country, isDefault } = req.body;

            // If setting as default, unset other default addresses for this user
            if (isDefault) {
                await CheckoutAddress.updateMany(
                    { userEmail: req.userEmail },
                    { isDefault: false }
                );
            }

            const newAddress = new CheckoutAddress({
                userEmail: req.userEmail,
                fullName,
                phone,
                address1,
                address2: address2 || "",
                city,
                state,
                pincode,
                country,
                isDefault: isDefault || false,
            });

            await newAddress.save();

            res.status(201).json({
                status: "ok",
                message: "Address saved successfully",
                data: newAddress,
            });
        } catch (error) {
            console.error("Error saving address:", error);
            res.status(500).json({ error: "Server error. Failed to save address." });
        }
    }
);

// Get all addresses for logged-in user
// GET /checkout-address/user
router.get("/user", authenticateUser, async (req, res) => {
    try {
        const addresses = await CheckoutAddress.find({ userEmail: req.userEmail }).sort({ createdAt: -1 });

        res.status(200).json({
            status: "ok",
            data: addresses,
        });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "Server error. Failed to fetch addresses." });
    }
});

// Get default address for logged-in user
// GET /checkout-address/default
router.get("/default", authenticateUser, async (req, res) => {
    try {
        const address = await CheckoutAddress.findOne({
            userEmail: req.userEmail,
            isDefault: true
        });

        if (!address) {
            // If no default, get the most recent one
            const recentAddress = await CheckoutAddress.findOne({
                userEmail: req.userEmail
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                status: "ok",
                data: recentAddress,
            });
        }

        res.status(200).json({
            status: "ok",
            data: address,
        });
    } catch (error) {
        console.error("Error fetching default address:", error);
        res.status(500).json({ error: "Server error. Failed to fetch address." });
    }
});

// Get specific address by ID
// GET /checkout-address/:id
router.get("/:id", authenticateUser, async (req, res) => {
    try {
        const address = await CheckoutAddress.findOne({
            _id: req.params.id,
            userEmail: req.userEmail, // Ensure user can only access their own addresses
        });

        if (!address) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            status: "ok",
            data: address,
        });
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ error: "Server error. Failed to fetch address." });
    }
});

// Update address
// PUT /checkout-address/:id
router.put("/:id", authenticateUser, async (req, res) => {
    try {
        const { fullName, phone, address1, address2, city, state, pincode, country, isDefault } = req.body;

        // If setting as default, unset other default addresses
        if (isDefault) {
            await CheckoutAddress.updateMany(
                { userEmail: req.userEmail, _id: { $ne: req.params.id } },
                { isDefault: false }
            );
        }

        const updatedAddress = await CheckoutAddress.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
            {
                fullName,
                phone,
                address1,
                address2: address2 || "",
                city,
                state,
                pincode,
                country,
                isDefault: isDefault || false,
                updatedAt: Date.now(),
            },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            status: "ok",
            message: "Address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Server error. Failed to update address." });
    }
});

// Delete address
// DELETE /checkout-address/:id
router.delete("/:id", authenticateUser, async (req, res) => {
    try {
        const deletedAddress = await CheckoutAddress.findOneAndDelete({
            _id: req.params.id,
            userEmail: req.userEmail,
        });

        if (!deletedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            status: "ok",
            message: "Address deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ error: "Server error. Failed to delete address." });
    }
});

// Set address as default
// PUT /checkout-address/set-default/:id
router.put("/set-default/:id", authenticateUser, async (req, res) => {
    try {
        // Unset all default addresses for this user
        await CheckoutAddress.updateMany(
            { userEmail: req.userEmail },
            { isDefault: false }
        );

        // Set the specified address as default
        const updatedAddress = await CheckoutAddress.findOneAndUpdate(
            { _id: req.params.id, userEmail: req.userEmail },
            { isDefault: true, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ error: "Address not found" });
        }

        res.status(200).json({
            status: "ok",
            message: "Default address updated successfully",
            data: updatedAddress,
        });
    } catch (error) {
        console.error("Error setting default address:", error);
        res.status(500).json({ error: "Server error. Failed to set default address." });
    }
});

module.exports = router;
