import mongoose from "mongoose";

const ConcertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
    },
    dateStart: {
        type: Date,
        required: true,
    },
    dateEnd: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    tickets: {
        available: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: true
        }
    },
    // categories: [{
    //     type: 
    // }]
})


export const ConcertModel = mongoose.model('Concert', ConcertSchema)
