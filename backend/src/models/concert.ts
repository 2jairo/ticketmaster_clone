import mongoose from "mongoose";
import slugify from "slugify";

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
    tickets: {
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
    },
    // categories: [{
    //     type: 
    // }]
})

ConcertSchema.pre('save', function(next) {
    this.slug = `${slugify(this.title)}-${crypto.randomUUID()}` 
    return next()
})



ConcertSchema.methods.toConcertResponse = function() {
    return {
        title: this.title,
        slug: this.slug,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        description: this.description,
        tickets: {
            available: this.tickets.available,
            price: this.tickets.price,
            sold: this.tickets.sold
        }
    }
}

export const ConcertModel = mongoose.model<{
    toConcertResponse: () => any
}>('Concert', ConcertSchema)
