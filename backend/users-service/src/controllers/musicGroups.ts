import asyncHandler from "express-async-handler";
import { MusicGroupModel } from "../models/musicGroup";
import { ErrKind, LocalError } from "../error/err";


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