import express from 'express'
import formidable from "express-formidable";

import {
    createProduct, getproduct, deleteProductController,
    brainTreePaymentController,
    braintreeTokenController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFiltersController,
    productListController,
    productPhotoController,
    realtedProductController,
    searchProductController,
    updateProductController,
}
    from '../controllers/productController.js';

import { requireSignIn, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

// create product 
router.post('/create-product', requireSignIn, isAdmin, formidable(), createProduct);

//get all prodect
router.get('/getproduct', getproduct);

// get single product
router.get("/get-product/:slug", getSingleProductController);

// get product photo
router.get("/product-photo/:pid", productPhotoController);

// update photo
router.put("/update-product/:pid", requireSignIn, isAdmin, formidable(), updateProductController);


//delete product
router.delete("/delete-product/:pid", deleteProductController);


//filter product
router.post("/product-filters", productFiltersController);

//product count
router.get("/product-count", productCountController);

//product per page
router.get("/product-list/:page", productListController);

//search product
router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//category wise product
router.get("/product-category/:slug", productCategoryController);

//payments routes
//token
router.get("/braintree/token", braintreeTokenController);

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);

export default router;