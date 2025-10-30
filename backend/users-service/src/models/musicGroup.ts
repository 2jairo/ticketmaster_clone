import mongoose from "mongoose";
import slugify from "slugify";
import type { IUserModel } from "./user";


const MusicGroupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    followers: {
        type: Number,
        default: 0,
        required: true
    }
})

MusicGroupSchema.pre('save', function(next) {
    const slugifiedTitle = slugify(this.title)
    const currentSlugifiedTitle = (this.slug || '').split('-')
    currentSlugifiedTitle.pop()
    
    if(!this.slug || slugifiedTitle !== currentSlugifiedTitle.join('-')) {
        const uuid = crypto.randomUUID().replaceAll('-', '')
        this.slug = `${slugifiedTitle}-${uuid}` 
    }
    return next()
})

MusicGroupSchema.methods.toMusicGroupConcertDetailsResponse = function(user?: IUserModel) {
    return {
        title: this.title,
        slug: this.slug,
        image: this.image,
        followers: this.followers,
        following: user ? user.isFollowingGroup(this._id) : false
    }
}

MusicGroupSchema.methods.toMusicGroupResponse = function() {
    return {
        title: this.title,
        slug: this.slug,
        description: this.description,
        image: this.image,
        followers: this.followers
    }
}

MusicGroupSchema.methods.updateFollowers = function(offset: number) {
    this.followers += offset
}

export interface IMusicGroupModel {
    toMusicGroupConcertDetailsResponse: (user?: IUserModel) => any
    toMusicGroupResponse: () => any
    updateFollowers: (offset: number) => void 
}

export const MusicGroupModel = mongoose.model<IMusicGroupModel>('MusicGroup', MusicGroupSchema)
