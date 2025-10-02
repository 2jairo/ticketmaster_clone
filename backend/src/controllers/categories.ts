import asyncHandler from "express-async-handler";
import { CategoryModel } from "../models/category";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find()
    categories.map(c => c.title)
    res.send(categories.map(c => c.toCategoryResponse()))
})

export const createCategory = asyncHandler(async (req, res) => {
    const category = new CategoryModel(req.body)
    const savedCategory = await category.save()

    res.send(savedCategory.toCategoryResponse())
})