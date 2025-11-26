import asyncHandler from "express-async-handler";
import { MerchModel } from "../models/merch";
import { MerchCategoryModel } from "../models/merchCategory";

const MERCH_PAGE_SIZE = 20;

export const getMerch = asyncHandler(async (req, res) => {
    const { title, priceMin, priceMax, category, size, offset } = req.query;

    const filters: any = {};

    if (title) {
        filters.title = { $regex: title, $options: "i" };
    }

    if (priceMin || priceMax) {
        filters.price = {};
        if (priceMin) {
            filters.price.$gte = Number(priceMin);
        }
        if (priceMax) {
            filters.price.$lte = Number(priceMax);
        }
    }

    if (category) {
        const categoryDoc = await MerchCategoryModel.findOne({ slug: category });
        if (categoryDoc) {
            filters.categoryId = categoryDoc._id;
        }
    }

    const merch = await MerchModel.find(filters)
        .limit(Number(size) || MERCH_PAGE_SIZE)
        .skip(Number(offset) || 0);

    const totalCount = await MerchModel.find(filters).countDocuments();

    res.status(200).json({
        merch: await Promise.all(merch.map((m) => m.toConcertDetailsResponse())),
        totalCount
    });
});
