const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 5000; // The port where your backend will run

// Use CORS to allow requests from the frontend
app.use(cors());

// Serve static files in the "uploads" folder (this is where the files will be stored)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer to store files in the "uploads" folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir); // Create the "uploads" folder if it doesn't exist
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Store files with their original names
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Endpoint to upload a file
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    // Send back the file path as a response
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Endpoint to retrieve a list of uploaded files
app.get('/files', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Unable to retrieve files' });
        }
        // Send back the list of files
        res.json({ files: files });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
