import mongoose from "mongoose";

export type ConcertEmbedding = {
    title: string
    description: string
    locationName: string
    embedding: number[]
}
export interface IConcertEmbeddingSchemaMethods {
}


const ConcertEmbedding = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    locationName: {
        type: String,
        required: true
    },
    embedding: [{
        type: Number
    }],
    isActive: {
        type: Boolean,
        default: true
    }
})

ConcertEmbedding.pre(/^find/, function() {
    //@ts-ignore
    this.where({ isActive: true });
})


export const ConcertEmbeddingModel = mongoose.model<ConcertEmbedding & IConcertEmbeddingSchemaMethods>('ConcertEmbedding', ConcertEmbedding)