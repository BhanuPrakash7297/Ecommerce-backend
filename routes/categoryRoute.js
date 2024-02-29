import mongoose from "mongoose";
import express from 'express'
import { Router } from "express";
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import { CategoryController, CategoryUpdateController, DeleteCategory, GetAllCategories, getCategory } from "../controllers/categoryController.js";
import categoryModel from "../models/categoryModel.js";

const router = express.Router();

router.post('/create-category', requireSignIn, isAdmin, CategoryController);
router.put('/update-category/:id', requireSignIn, isAdmin, CategoryUpdateController);
router.get('/allcategory', GetAllCategories);
router.get('/getcategory/:slug', getCategory);
router.delete('/deletecategory/:id', DeleteCategory);

export default router;

