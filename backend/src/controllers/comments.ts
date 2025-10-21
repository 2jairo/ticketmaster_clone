import asyncHandler from 'express-async-handler'
import { UserModel } from '../models/user';
import { ErrKind, LocalError } from '../error/err';
import { ConcertModel } from '../models/concert';
import { CommentModel } from '../models/comments';

const COMMENTS_PER_PAGE = 10

export const createComment = asyncHandler(async (req, res) => {
    const commenter = await UserModel.findById(req.userId)
    if (!commenter) {
        throw new LocalError(ErrKind.UserNotFound, 400)
    }

    const { concertSlug } = req.params
    const concert = await ConcertModel.findOne({ slug: concertSlug })
    if (!concert) {
        throw new LocalError(ErrKind.ConcertNotFound, 400)
    }

    const newComment = new CommentModel({
        comment: req.body.comment,
        author: commenter._id,
        concertId: concert._id,
    })
    const savedComment = await newComment.save();

    concert.addComment(newComment._id);
    await concert.save()

    res.status(200).json(await savedComment.toCommentResponse(commenter))
})

export const getComments = asyncHandler(async (req, res) => {
    const { concertSlug } = req.params;
    const { size, offset } = req.query

    const concert = await ConcertModel.findOne({ slug: concertSlug }).exec();
    if (!concert) {
        throw new LocalError(ErrKind.ConcertNotFound, 400)
    }

    const loginUser = req.userId
        ? await UserModel.findById(req.userId) || undefined
        : undefined

    const commentsRaw = await CommentModel.find({ 
        _id: { $in: concert.comments.slice(Number(offset) || 0, (Number(offset) || 0) + (Number(size) || COMMENTS_PER_PAGE)) }
    }).sort({ createdAt: -1 })

    const comments = await Promise.all(
        commentsRaw.map(c => c.toCommentResponse(loginUser))
    )

    res.status(200).json(comments)
});

export const deleteComment = asyncHandler(async (req, res) => {
    const commenter = await UserModel.findById(req.userId)

    if (!commenter) {
        throw new LocalError(ErrKind.UserNotFound, 400)
    }

    const { concertSlug, commentId } = req.params;
    const concert = await ConcertModel.findOne({ slug: concertSlug })
    if (!concert) {
        throw new LocalError(ErrKind.ConcertNotFound, 400)
    }

    const comment = await CommentModel.findById(commentId)
    if(!comment) {
        throw new LocalError(ErrKind.CommentNotFound, 400)
    }

    if (comment.author.toString() === commenter._id.toString()) {
        concert.removeComment(comment._id)
        await concert.save()

        await CommentModel.deleteOne({ _id: comment._id })
        res.status(200).send()
    } else {
        throw new LocalError(ErrKind.Unauthorized, 401)
    }
});


export const setLikeComment = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId)
    if (!user) {
        throw new LocalError(ErrKind.UserNotFound, 400)
    }

    const { commentId } = req.params
    const comment = await CommentModel.findById(commentId)
    if(!comment) {
        throw new LocalError(ErrKind.CommentNotFound, 400)
    }

    const newValue = req.query.newValue === 'true'
    comment.setLike(user._id, newValue)
    await comment.save()
    
    res.status(200).send()
});