const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use Memory Storage (Keep file in RAM, don't write to disk)
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, admin, upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');

    // Upload to Cloudinary stream
    const uploadStream = cloudinary.uploader.upload_stream(
        {
            folder: 'blog-app', // Folder name in Cloudinary
        },
        (error, result) => {
            if (error) {
                console.error('Cloudinary Upload Error:', error);
                return res.status(500).send('Image upload failed');
            }
            // Return the Cloudinary URL
            res.send(result.secure_url);
        }
    );

    // Pipe the file buffer to Cloudinary
    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

module.exports = router;
