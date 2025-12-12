import asyncHandler from "express-async-handler";
import { ConcertModel } from "../models/concert";
import { CategoryModel } from "../models/category";
import { ErrKind, LocalError } from "../error/err";
import { UserModel } from "../models/user";
import { ConcertEmbeddingModel } from "models/concertEmbeddings";
import { llmStudio } from "utils/axios";

const CONCERTS_PAGE_SIZE = 5

function cosineSimilarity(a: number[], b: number[]) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (normA * normB);
}

export const getConcerts = asyncHandler(async (req, res) => {
    const { title, priceMax, priceMin, dateStart, dateEnd, category, sortBy, size, offset: offsetParam, lat, lng } = req.query

    const offset = Number(offsetParam) || 0
    const limit = Number(size) || CONCERTS_PAGE_SIZE

    if(title && typeof title === 'string' && title.length > 5) {
        const queryEmbeddings = await llmStudio.getEmbeddings(title)
        
        const embeddings = (await ConcertEmbeddingModel.find())
            .map((d) => {
                return { d, similarity: cosineSimilarity(d.embedding, queryEmbeddings) }
            })
            .sort((a, b) => b.similarity - a.similarity)
        
        const embeddingOrder = embeddings
            .slice(offset, offset + limit)
            .map((e) => e.d._id.toString())

        const concerts = await ConcertModel.find({
            _id: { $in: embeddingOrder }
        })

        const concertsResp = await Promise.all(concerts
            .sort((a, b) => embeddingOrder.indexOf(a._id.toString()) - embeddingOrder.indexOf(b._id.toString()))
            .map(c => c.toConcertResponse())
        ).then((concerts) => concerts.filter(c => c.tickets !== null))
        
        res.send({
            concerts: concertsResp,
            totalCount: embeddings.length
        })
        return
    }



    const filters: any = {};
    let sortOption: any = {}

    if (priceMin || priceMax) {
        // filters.$and = [];
        // if (priceMin) {
        //     filters.$and.push({ "tickets.price": { $gte: Number(priceMin) } });
        // }
        // if (priceMax) {
        //     filters.$and.push({ "tickets.price": { $lte: Number(priceMax) } });
        // }
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

    switch (sortBy) {
        case 'most_sold':
            sortOption = { totalTicketsSold: 1 } 
            break;
        case 'starting_soon':
            sortOption = { dateStart: 1 }
            filters.dateEnd = { ...(filters.dateEnd || {}), $gte: new Date() }
            break;
        case 'nearest':
            if (!lat || !lng) {
                throw new LocalError(ErrKind.RequiredConstraintViolation, 400, `lat and lng are required for 'nearest' sort`)
            }
            //TODO

            filters.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $minDistance: 0,
                    $maxDistance: 50_000
                }
            }
            break
    }


    const concerts = await ConcertModel.find(filters)
        .sort(sortOption)
        .limit(Number(size) || CONCERTS_PAGE_SIZE)
        .skip(Number(offset) || 0)
        
    const totalCount = await ConcertModel.find(filters).countDocuments()
    const concertsResp = await Promise.all(
        concerts.map(c => c.toConcertResponse())
    ).then((concerts) => concerts.filter(c => c.tickets !== null))

    res.send({
        concerts: concertsResp, 
        totalCount
    })
})

export const getConcertDetails = asyncHandler(async (req, res) => {
    const concert = await ConcertModel.findOne({ slug: req.params.slug })

    if(!concert) {
        throw new LocalError(ErrKind.ConcertNotFound, 404)
    }

    const user = req.logged
        ? await UserModel.findById(req.userId) || undefined
        : undefined
    
    res.send(await concert.toConcertDetailsResponse(user))
})