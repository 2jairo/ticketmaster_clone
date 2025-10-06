import asyncHandler from "express-async-handler";
import { ConcertModel } from "../models/concert";
import { CategoryModel } from "../models/category";

const CONCERTS_PAGE_SIZE = 5

export const getConcerts = asyncHandler(async (req, res) => {
    const { title, priceMax, priceMin, dateStart, dateEnd, category, size, offset } = req.query

    const filters: any = {};

    if (title) {
        filters.title = { $regex: title, $options: "i" };
    }
    if (priceMin || priceMax) {
        filters.$and = [];
        if (priceMin) {
            filters.$and.push({ "tickets.price": { $gte: Number(priceMin) } });
        }
        if (priceMax) {
            filters.$and.push({ "tickets.price": { $lte: Number(priceMax) } });
        }
    }
    if (dateStart) {
        filters.dateStart = {
            $gte: new Date(dateStart as string)
        }
    }
    if (dateEnd) {   
        filters.dateEnd = {
            $lte: new Date(dateEnd as string)
        }
    }
    
    if (category) {
        const categoryDoc = await CategoryModel.findOne({ slug: category });
        if (categoryDoc) {
            filters.categories = categoryDoc._id;
        }
    }

    const concerts = await ConcertModel.find(filters)
        .limit(Number(size) || CONCERTS_PAGE_SIZE)
        .skip(Number(offset) || 0)
        
    const totalCount = await ConcertModel.find(filters).countDocuments()
    res.send({
        concerts: concerts.map(c => c.toConcertResponse()), 
        totalCount
    })
})

export const createConcert = asyncHandler(async (req, res) => {
    const concert = new ConcertModel(req.body)
    const savedConcert = await concert.save()
    res.status(201).send(savedConcert.toConcertResponse())
})

export const createMultipleConcerts = asyncHandler(async (req, res) => {
    for (const c of req.body) {
        const concert = new ConcertModel(c)
        await concert.save()
    }
    res.send('test')
})


export const getConcertDetails = asyncHandler(async (req, res) => {
    const concert = await ConcertModel.findOne({ slug: req.params.slug })

    if(!concert) {
        res.status(404).send({ msg: "concert not found" })
        return
    }
    
    res.send(await concert.toConcertDetailsResponse())
})