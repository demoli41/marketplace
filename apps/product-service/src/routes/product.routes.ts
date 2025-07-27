import express, {Router} from 'express';
import { createDiscountCodes, createProduct, deleteDiscountCode, deleteProduct, deleteProductImage, getShopProducts, getAllProducts, getCategories, getDiscountCodes, restoreProduct, uploadProductImage, getProductDetails, getFilteredProducts, getFilteredEvents, getFilteredShops, searchProducts } from '../controllers/product.controller';
import isAuthenticated from '@packages/middleware/isAuthenticated';

const router:Router=express.Router();

router.get("/get-categories",getCategories);
router.post("/create-discount-code",isAuthenticated, createDiscountCodes);
router.get("/get-discount-codes",isAuthenticated, getDiscountCodes);
router.delete("/delete-discount-code/:id",isAuthenticated, deleteDiscountCode);
router.post("/upload-product-image",isAuthenticated,uploadProductImage);
router.delete("/delete-product-image",isAuthenticated,deleteProductImage);
router.post("/create-product",isAuthenticated,createProduct);
router.get("/get-shop-products",isAuthenticated,getShopProducts);
router.delete("/delete-product/:productId",isAuthenticated,deleteProduct);
router.put("/restore-product/:productId",isAuthenticated,restoreProduct);
router.get("/get-all-products",getAllProducts);
router.get("/get-product/:slug",getProductDetails);
router.get("/get-filtered-products",getFilteredProducts);
router.get("/get-filtered-offers",getFilteredEvents);
router.get("/get-filtered-shops",getFilteredShops);
router.get("/search-products",searchProducts);
//router.get("/get-top-shops", getTopShops);


export default router;