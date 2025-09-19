const User = require("../models/userModel");
const s3 = require("../config/s3");
const { v4: uuidv4 } = require("uuid");

// Create User with Image
const createUser = async (req, res) => {
    try {
        let imageUrl = null;
      
        if (req.file) {
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: `users/${uuidv4()}_${req.file.originalname}`,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
                //ACL: "public-read"
            };
            const uploadedImage = await s3.upload(params).promise();
            imageUrl = uploadedImage.Location;
        }

        const user = await User.create({
            ...req.body,
            imageUrl
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Read all
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Read one
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(404).json({ error: "User not found" });
    }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser };
