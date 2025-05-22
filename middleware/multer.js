import express from 'express';
import multer from 'multer';
import { addProduct } from '../controllers/productController.js';

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/'  });

// Express app setup
const app = express();
app.use(express.json());
    
  
  
// Routes
app.post('/add-product', upload.fields([
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
]), addProduct);


export default upload;