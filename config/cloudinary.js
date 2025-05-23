import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dm8pcdkgc",
  api_key: "778388297935614",
  api_secret: "2kDrHjTCDxYBHWO8EoXv5dQAGsI",
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
