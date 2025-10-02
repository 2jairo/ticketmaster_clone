import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import type { CategoryDocument } from "./category";


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
    images: [{
        type: String,
        required: true,
    }],
    mapImg: {
        type: String,
    },
    thumbnailImg: {
        type: String,
    },
    locationName: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: (value: any[]) => {
                    return value.length === 2
                },
                message: (props: { value: any; }) => `${props.value} must be [lng, lat]`
            }
        }
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
        },
    }],
    // participants: [{
        
    // }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }]
})

ConcertSchema.index({ location: '2dsphere' })

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
        images: {
            carousel: this.images || [],
        },
        locationName: this.locationName,
        tickets: this.tickets.length === 0 ? null : tickets
    }
}

ConcertSchema.methods.toConcertDetailsResponse = async function() {
    await this.populate('categories')

    return {
        title: this.title,
        slug: this.slug,
        dateStart: this.dateStart,
        dateEnd: this.dateEnd,
        description: this.description,
        images: {
            carousel: this.images || [],
            map: this.mapImg || null,
            thumbnail: this.thumbnailImg || null,
        },
        locationName: this.locationName,
        location: this.location,
        tickets: this.tickets.sort((a: ConcertTicket, b: ConcertTicket) => b.price - a.price),
        categories: this.categories.map((cat: CategoryDocument) => cat.toCategoryConcertDetailsResponse())
    }
}

interface IConcertModel {
    toConcertResponse: () => any
    toConcertDetailsResponse: () => Promise<any>

    title: string
    slug?: string
    dateStart: Date
    dateEnd: Date,
    description: string
    images: string[],
    mapImg?: string,
    thumbnailImg?: string,
    tickets: ConcertTicket[]
    categories: Schema.Types.ObjectId[],
    locationName: string,
    location: {
        type: string,
        coordinates: [number, number]
    }
}

export const ConcertModel = mongoose.model<IConcertModel>('Concert', ConcertSchema)