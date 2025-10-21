import asyncHandler from "express-async-handler";
import { MusicGroupModel } from "../models/musicGroup";
import { ErrKind, LocalError } from "../error/err";
import { UserModel } from "../models/user";

export const createMusicGroup = asyncHandler(async (req, res) => {
    const group = new MusicGroupModel(req.body)
    const savedGroup = await group.save()
    res.status(201).send(savedGroup.toMusicGroupResponse())
})

export const createMultipleMusicGropus = asyncHandler(async (req, res) => {
    for (const c of req.body) {
        const group = new MusicGroupModel(c)
        await group.save()
    }
    res.send('test')
})


export const getMusicGroupDetails = asyncHandler(async (req, res) => {
    const group = await MusicGroupModel.findOne({ slug: req.params.slug })

    if(!group) {
        throw new LocalError(ErrKind.MusicGroupNotFound, 404)
    }
    
    res.send(group.toMusicGroupResponse())
})

export const getMusicGroups = asyncHandler(async (req, res) => {
    const groups = await MusicGroupModel.find()
    res.send(groups.map((g) => g.toMusicGroupResponse()))
})