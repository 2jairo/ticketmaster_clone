import mongoose, { Schema } from "mongoose";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    replies: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    concertId: {
        type: Schema.Types.ObjectId,
        ref: 'Concert'
    },
})

export const CommentModel = mongoose.model('Comment', CommentSchema)