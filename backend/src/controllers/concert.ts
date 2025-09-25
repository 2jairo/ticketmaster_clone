import asyncHandler from "express-async-handler";
import { ConcertModel } from "../models/concert";

export const getAllConcerts = asyncHandler(async (req, res) => {
    const concerts = await ConcertModel.find()
    res.send(concerts)
})