import asyncHandler from "express-async-handler";
import { ConcertModel } from "../models/concert";

export const getConcerts = asyncHandler(async (req, res) => {
    const concerts = await ConcertModel.find()
    res.send(concerts.map(c => c.toConcertResponse()))
})

export const createConcert = asyncHandler(async (req, res) => {
    const concerts = req.body.map((data: any) => new ConcertModel(data));
    const savedConcerts = await ConcertModel.insertMany(concerts);
    res.status(201).send(savedConcerts.map(c => c.toConcertResponse()));
})