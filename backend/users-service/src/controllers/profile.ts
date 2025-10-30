import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import { ErrKind, LocalError } from "../error/err";
import { MusicGroupModel } from "../models/musicGroup";

export const followMusicGroup = asyncHandler(async (req, res) => {
    const { groupSlug } = req.params

    const user = await UserModel.findById(req.userId)
    if(!user) {
        throw new LocalError(ErrKind.UserNotFound, 400)
    }

    const group = await MusicGroupModel.findOne({ slug: groupSlug })
    if(!group) {
        throw new LocalError(ErrKind.MusicGroupNotFound, 400)
    }

    const newValue = req.query.newValue === 'true'
    const changed = user.setGroupFollow(group._id, newValue)
    await user.save()

    if(changed) {
        group.updateFollowers(newValue ? 1 : -1)
        await group.save()
    }

    res.status(200).send()
})

export const followUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    const currentUser = await UserModel.findById(req.userId)
    if(!currentUser) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    const followUser = await UserModel.findOne({ username })
    if(!followUser) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    const newValue = req.query.newValue === 'true'
    const offset = currentUser.setUserFollow(followUser._id, newValue)
    await currentUser.save()

    if(offset !== 0) {
        followUser.updateFollowers(offset)
        await followUser.save()
    }

    res.status(200).json()
})

export const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params

    const profileUser = await UserModel.findOne({ username })
    if(!profileUser) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }
    
    let resp
    if(req.logged) {
        const currentUser = await UserModel.findById(req.userId)
        if(!currentUser) {
            throw new LocalError(ErrKind.UserNotFound, 404)
        }

        resp = await profileUser.toProfileResponse(currentUser, req.userId)
    } else {
        resp = await profileUser.toProfileResponse()
    }

    res.status(200).json(resp)
})