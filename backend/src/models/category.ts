import mongoose from "mongoose";
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
    image: {
        type: String
    }
})


CategorySchema.pre('save', function(next)  {
    this.slug = `${slugify(this.title)}-${crypto.randomUUID()}`
    return next()  
})


CategorySchema.methods.toCategoryResponse = function() {
    return {
        title: this.title,
        slug: this.slug,
        image: this.image
    }
}

export const CategoryModel = mongoose.model<{
    toCategoryResponse: () => any
}>('Category', CategorySchema)

