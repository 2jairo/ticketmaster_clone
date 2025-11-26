import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import type { CategoryDocument } from "./category";
import type { IMusicGroupModel } from "./musicGroup";
import type { IUserModel } from "./user";
import { ConcertTicket, TicketModel } from "./tickets";

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
    totalTicketsSold: {
        type: Number,
        required: true,
        default: 0,
    },
    groups: [{
        type: Schema.Types.ObjectId,
        ref: 'MusicGroup'
    }],
    categories: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING'
    }
})

ConcertSchema.index({ location: '2dsphere' })

ConcertSchema.pre('save', function(next) {
    const slugifiedTitle = slugify(this.title)
    const currentSlugifiedTitle = (this.slug || '').split('-')
    currentSlugifiedTitle.pop()
    
    if(!this.slug || slugifiedTitle !== currentSlugifiedTitle.join('-')) {
        const uuid = crypto.randomUUID().replaceAll('-', '')
        this.slug = `${slugifiedTitle}-${uuid}` 
    }
    return next()
})
ConcertSchema.pre('insertMany', function(next) {
    console.log(this)
    return next()
})

ConcertSchema.pre(/^find/, function() {
    //@ts-ignore
    this.where({ isActive: true, status: 'ACCEPTED' });
})

ConcertSchema.methods.toConcertResponse = async function() {
    const ticketModels = await TicketModel.find({
        concertId: this.id
    })

    const tickets = ticketModels.reduce((acc, ticket) => {
        acc.available += ticket.available
        acc.sold += ticket.sold
        acc.priceMax = Math.min(acc.priceMax, ticket.price)
        acc.priceMin = Math.max(acc.priceMin, ticket.price)
        return acc
    }, {
        available: 0,
        sold: 0,
        priceMax: Infinity,
        priceMin: -Infinity
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
        tickets: ticketModels.length === 0 ? null : tickets
    }
}

ConcertSchema.methods.toConcertDetailsResponse = async function(user?: IUserModel) {
    await this.populate(['categories', 'groups'])

    const tickets = await TicketModel.find({
        concertId: this.id
    })

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
        tickets: tickets,
        categories: this.categories.map((cat: CategoryDocument) => cat.toCategoryConcertDetailsResponse()),
        groups: this.groups.map((g: IMusicGroupModel) => g.toMusicGroupConcertDetailsResponse(user))
    }
}

ConcertSchema.methods.addComment = function (commentId: mongoose.Types.ObjectId) {
    this.comments.unshift(commentId)
};

ConcertSchema.methods.removeComment = function (commentId: mongoose.Types.ObjectId) {
    const commentidStr = commentId.toString()
    this.comments = this.comments.filter((id: mongoose.Types.ObjectId) => id.toString() !== commentidStr);
};


interface IConcertModel {
    toConcertResponse: () => Promise<any>
    toConcertDetailsResponse: (user?: IUserModel) => Promise<any>
    addComment: (commentId: mongoose.Types.ObjectId) => void
    removeComment: (commentId: mongoose.Types.ObjectId) => void

    title: string
    slug?: string
    dateStart: Date
    dateEnd: Date,
    description: string
    images: string[],
    mapImg?: string,
    thumbnailImg?: string,
    totalTicketsSold: number
    tickets: Schema.Types.ObjectId[]
    categories: Schema.Types.ObjectId[],
    locationName: string,
    location: {
        type: string,
        coordinates: [number, number]
    }
    comments: Schema.Types.ObjectId[],
}

export const ConcertModel = mongoose.model<IConcertModel>('Concert', ConcertSchema)