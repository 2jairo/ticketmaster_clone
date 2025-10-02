import asyncHandler from "express-async-handler";
import { ConcertModel } from "../models/concert";

export const getConcerts = asyncHandler(async (req, res) => {
    const concerts = await ConcertModel.find()
    res.send(concerts.map(c => c.toConcertResponse()))
})

export const createConcert = asyncHandler(async (req, res) => {
    const concert = new ConcertModel(req.body)
    const savedConcert = await concert.save()
    res.status(201).send(savedConcert.toConcertResponse())
})

// export const createConcert = asyncHandler(async (req, res) => {
//     for (const c of req.body) {
//         const concert = new ConcertModel(c)
//         await concert.save()
//     }
//     res.send('test')
// })


export const getConcertDetails = asyncHandler(async (req, res) => {
    const concert = await ConcertModel.findOne({ slug: req.params.slug })

    if(!concert) {
        res.status(404).send({ msg: "concert not found" })
        return
    }
    
    res.send(await concert.toConcertDetailsResponse())
})