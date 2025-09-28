import mongoose from "mongoose";
import slugify from "slugify";


type ConcertTicket = {
    sold: number
    available: number
    price: number
    location: string
}

const ConcertSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
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
        trim: true,
        required: true
    },
    tickets: [{
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
        }
    }]
    // categories: [{
    //     type: 
    // }]
})

ConcertSchema.pre('save', function(next) {
    this.slug = `${slugify(this.title)}-${crypto.randomUUID()}` 
    return next()
})
ConcertSchema.pre('insertMany', function(next) {
    console.log(this)
    return next()
})

ConcertSchema.methods.toConcertResponse = function() {
    const tickets = (this.tickets as ConcertTicket[]).reduce((acc, ticket) => {
        acc.available += ticket.available
        acc.sold += ticket.sold
        acc.price = Math.min(acc.price, ticket.price)
        return acc
    }, {
        available: 0,
        sold: 0,
        price: Infinity
    })

    return {
        title: this.title,
        slug: this.slug,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        description: this.description,
        tickets: this.tickets.length === 0 ? null : tickets
    }
}

export const ConcertModel = mongoose.model<{
    toConcertResponse: () => any
}>('Concert', ConcertSchema)
