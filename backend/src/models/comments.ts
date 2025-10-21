import mongoose, { Schema, Types } from "mongoose";
import { UserModel, type IUserModel } from "./user";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    concertId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Concert'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        required: true,
        red: 'User'
    }]
}, {
    timestamps: true
})

CommentSchema.methods.toCommentResponse = async function (user?: IUserModel) {
    const authorObj = await UserModel.findById(this.author)

    return {
        id: this._id,
        comment: this.comment,
        createdAt: this.createdAt,
        owner: this.author.toString() === user?._id?.toString(),
        liked: user ? this.userLiked(user._id) : false,
        author: authorObj?.toProfileResponse(user)
    }
};

CommentSchema.methods.userLiked = function(userId: Types.ObjectId) {
    const userIdStr = userId.toString()
    return this.likes.some((id: Types.ObjectId) => id.toString() === userIdStr)
}

CommentSchema.methods.setLike = function(userId: Types.ObjectId, newValue: boolean) {
    const userIdStr = userId.toString()

    if (newValue) {
        if (!this.likes.some((id: Types.ObjectId) => id.toString() === userIdStr)) {
            this.likes.push(userId);
        }
    } else {
        this.likes = this.likes.filter((id: Types.ObjectId) => id.toString() !== userIdStr);
    }
} 

interface ICommentModel {
    comment: string
    author: Schema.Types.ObjectId
    concertId: Schema.Types.ObjectId

    setLike: (userId: Types.ObjectId, newValue: boolean) => void
    toCommentResponse: (user?: IUserModel) => Promise<any>
}


export const CommentModel = mongoose.model<ICommentModel>('Comment', CommentSchema)