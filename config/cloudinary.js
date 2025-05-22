import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dlfo1tyme",
  api_key: "159464461333919",
  api_secret: "svvKXOlHvb9d8ZA0-mKaWEHgG9A",
});

const uploadToCloudinary = async (filePath) => {
  try {
    if (!filePath) {
      throw new Error('File path is not provided');
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'your_folder_name', 
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    if (result && result.secure_url) {
      return result.secure_url;
    } else {
      throw new Error('Upload failed: No secure_url in result');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default uploadToCloudinary;
