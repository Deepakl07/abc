import express from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure the `/uploads` folder exists
const uploadsPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`Uploads folder created at ${uploadsPath}`);
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);  // Save files to `/uploads`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  },
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    const pythonScript = path.join(__dirname, '../ml/predict.py');
    const pythonProcess = spawn('python', [pythonScript, req.file.path]);
    
    let result = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      res.status(500).json({ error: 'Failed to process image' });
    });

    pythonProcess.on('close', (code) => {
      // Clean up: remove uploaded file
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (code !== 0) {
        return res.status(500).json({ 
          error: 'Error processing image',
          details: errorOutput
        });
      }

      try {
        const prediction = JSON.parse(result.trim());
        if (prediction.error) {
          return res.status(500).json({ error: prediction.error });
        }
        res.json(prediction);
      } catch (error) {
        console.error('Error parsing prediction result:', error);
      res.status(500).json({ error: 'Invalid prediction result' });
      }
    });
  } catch (error) {
    console.error('Server error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
