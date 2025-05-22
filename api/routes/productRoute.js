import express from "express";

import {
  addProduct,
  removeProduct,
  listProdcuts,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import { protectRoute, protectAdminRoute } from "../middleware/auth.middleware.js";


const productRouter = express.Router();

// POST /api/products/add
productRouter.post(
  "/add",
  protectRoute,
  protectAdminRoute,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

productRouter.delete("/delete/:id", protectRoute, protectAdminRoute, removeProduct);
productRouter.get("/single/:id", singleProduct);
productRouter.get("/list", listProdcuts);

export default productRouter;
