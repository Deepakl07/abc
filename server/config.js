import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 3000,
  uploadsDir: path.join(__dirname, '../uploads'),
  pythonScript: path.join(__dirname, '../MajorTomato.ipynb'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173', // For CORS
};
