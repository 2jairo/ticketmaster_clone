import asyncHandler from "express-async-handler";
import { CategoryModel } from "../models/category";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find()
    res.send(categories.map(c => c.toCategoryResponse()))
})

export const getCategoriesTitle = asyncHandler(async (req, res) => {
    const categories = await CategoryModel.find()
    res.send(categories.map(c => c.toCategoryConcertDetailsResponse()))
})