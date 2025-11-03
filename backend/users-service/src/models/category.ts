import mongoose, { Schema } from "mongoose";
import slugify from 'slugify'

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
    },
    images: [{
        type: String,
        required: true
    }],
    concerts: [{
        type: Schema.Types.ObjectId,
        ref: 'Concert'
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

CategorySchema.pre('save', function(next)  {
    const slugifiedTitle = slugify(this.title)
    const currentSlugifiedTitle = (this.slug || '').split('-')
    currentSlugifiedTitle.pop()
    
    if(!this.slug || slugifiedTitle !== currentSlugifiedTitle.join('-')) {
        const uuid = crypto.randomUUID().replaceAll('-', '')
        this.slug = `${slugifiedTitle}-${uuid}` 
    }
    return next()
})

CategorySchema.pre(/^find/, function() {
    //@ts-ignore
    this.where({ isActive: true, status: 'ACCEPTED' });
})


CategorySchema.methods.toCategoryResponse = function() {
    return {
        title: this.title,
        slug: this.slug,
        images: this.images
    }
}

CategorySchema.methods.toCategoryConcertDetailsResponse = function() {
    return {
        title: this.title,
        slug: this.slug
    }
}



interface ICategoryModel {
    title: string
    slug?: string
    images: string[]

    toCategoryResponse: () => any,
    toCategoryConcertDetailsResponse: () => any
}

export const CategoryModel = mongoose.model<ICategoryModel>('Category', CategorySchema)


export type CategoryDocument = mongoose.Document<unknown, {}, ICategoryModel, {}, {}> 
& ICategoryModel 
& { _id: mongoose.Types.ObjectId } 
& { __v: number }