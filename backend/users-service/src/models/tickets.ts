import mongoose, { Schema } from "mongoose";

export type ConcertTicket = {
    sold: number
    available: number
    price: number
    location: string
}

const TicketSchema = new mongoose.Schema({
    sold: {
        type: Number,
        default: 0,
        required: true
    },
    available: {
        type: Number,
        default: 0,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    concertId: {
        type: Schema.Types.ObjectId,
        ref: 'Concert'
    },
})



export const TicketModel = mongoose.model<ConcertTicket>('ConcertTicket', TicketSchema)