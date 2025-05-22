import Product from '../models/productModel.js'
import uploadToCloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import cloudinary from 'cloudinary'; 



const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    // Parse sizes safely
    let parsedSizes = [];
    try {
      parsedSizes = JSON.parse(sizes);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid sizes format' });
    }

    const isBestseller = bestseller === 'true' ? true :false;

    // Handle image uploads dynamically
    const imageUrls = [];
    const imageKeys = ['image1', 'image2', 'image3', 'image4'];
    for (const key of imageKeys) {
      if (req.files[key] && req.files[key][0]) {
        const filePath = req.files[key][0].path;
        const imageUrl = await uploadToCloudinary(filePath);
        imageUrls.push(imageUrl);
      }
    }

    // Create product in the database
    const product = await Product.create({
      name,
      description,
      price,
      category,
      subCategory,
      sizes: parsedSizes,
      bestseller: isBestseller,
      images: imageUrls,
    });

    return res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding product',
      error: error.message,
    });
  }
};


const listProdcuts = async (req,res) => {

  try {
    const products = await Product.find({});

    return res.status(200).json({success:true,message:"product list done" ,products});

  } catch (error) {
    console.log('Error while listing product:', error);
    return res.status(500).json({ success: false, message: 'Error listingproduct', error: error.message });
  }
    
};
  

   const removeProduct = async (req, res) => {
    try {
      
  
      const productId = req.params.id;
      
     
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID format" });
      }
  
      
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
     
      if (product.images && product.images.length > 0) {
        for (const imageUrl of product.images) {
          
          console.log("Image URL:", imageUrl);
  
          const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
          console.log("Extracted publicId:", publicId);  
  
          try {
            
            const response = await cloudinary.uploader.destroy(publicId);
            console.log("Cloudinary delete response:", response);  
            
            if (response.result === 'ok') {
              console.log("Deleted image from Cloudinary:", publicId);
            } else {
              console.error("Failed to delete image from Cloudinary:", publicId);
            }
          } catch (error) {
            console.error("Error deleting image from Cloudinary:", error);
          }
        }
      }
  
      
      await Product.findByIdAndDelete(productId);
  
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error in removeProduct controller:", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
  

   

   const singleProduct = async (req, res) => {
    try {
      
      const { id } = req.params;
  
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
      }
  
      
      const product = await Product.findById(id);
  
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      
      res.json({ success: true, product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  
  
export {addProduct,removeProduct,listProdcuts,singleProduct}