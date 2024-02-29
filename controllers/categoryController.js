import slugify from "slugify";
import categoryModel from "../models/categoryModel.js"
import { response } from "express";


export const CategoryController = async (req, res) => {

    try {

        const { name } = req.body;

        if (!name) {
            return res.status(401).send({ message: "name is required" });
        }

        const existingCategory = await categoryModel.findOne({ name });

        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            });
        }

        const category = await new categoryModel({
            name,
            slug: slugify(name)
        }).save();



        res.status(201).send({
            success: true,
            message: 'category created succesfully',
            category
        });

    } catch (err) {
        console.log(err);

        res.status(500).send({
            success: false,
            err,
            message: 'Error in Category'
        });
    }

}


export const CategoryUpdateController = async (req, res) => {
    try {

        const { name } = req.body;
        const { id } = req.params;

        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true });

        res.status(200).send({
            success: true,
            message: 'Category Updated successfully',
            category,
        })



    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            err,
            message: 'Error while updating category'
        })
    }
}

// get all categories
export const GetAllCategories = async (req, res) => {
    try {

        const allCategory = await categoryModel.find();
        console.log(allCategory[0]);
        // const data = JSON.parse(allCategory);
        res.status(200).send({
            success: true,
            message: "Successfully recieved all categories",
            allCategory
        })



    } catch (err) {

        console.log(err);
        res.status(500).send({
            success: false,
            message: 'Error in receiving all categories',
            err
        });

    }
}



// get single categories

export const getCategory = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryModel.findOne({ slug });
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'There is no such category !'
            })
        }

        res.status(200).send({
            success: true,
            message: 'Successfully got categories here',
            category
        })
    }
    catch (err) {
        console.log(err);
        req.status(500).send({
            success: false,
            message: 'Error while getting category',
            err
        })
    }
}



export const DeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: 'successfully delete category'
        })
    }
    catch (err) {
        console.log(err);
        req.status(500).send({
            success: false,
            message: 'Error while deleting category',
            err
        })
    }
}