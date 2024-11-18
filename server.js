import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import logger from './server/logger.js'; 
import predictRouter from './server/routes/predict.js';

 // Assuming your logger.js file is properly configured

const app = express();

// Ensure the `/uploads` folder exists
const uploadsPath = path.join(path.resolve(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`Uploads folder created at ${uploadsPath}`);
} else {
  console.log(`Uploads folder already exists at ${uploadsPath}`);
}

// Apply middleware
app.use(helmet());
app.use(morgan('dev'));  // Use morgan for logging requests

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parser middleware for JSON
app.use(express.json());

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath);  // Save files to `/uploads`
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
  },
});
const upload = multer({ storage: storage });

// Prediction route
 
app.use('/predict', predictRouter);

// Generic route
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Error-handling middleware for logging and responding
app.use((err, req, res, next) => {
  console.error(err.stack);
  logger.error(err.message);  // Log the error with your logger
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server...');
  server.close(() => {
    console.log('Server closed.');
  });
});
