import mongoose, { Schema } from "mongoose";
import { ConcertModel } from "./concert";

export type ConcertTicket = {
    sold: number
    available: number
    price: number
    location: string
    concertId: mongoose.ObjectId
}
export interface ITicketSchemaMethods {
    toUserResponse: () => Promise<any>
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


TicketSchema.methods.toUserResponse = async function() {
    const concert = await ConcertModel.findById(this.concertId)

    return {
        id: this._id,
        sold: this.sold,
        available: this.available,
        price: this.price,
        location: this.location,
        concertSlug: concert?.slug,
        concertTitle: concert?.title,
        concertImages: concert?.images || [],
    }
}


export const TicketModel = mongoose.model<ConcertTicket & ITicketSchemaMethods>('ConcertTicket', TicketSchema)