import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import bcrypt from 'bcrypt'
import { ErrKind, LocalError } from "../error/err";



export const handleSignin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new UserModel({
        username,
        email,
        password: hashedPassword
    })

    const createdUser = await user.save()
    res.status(200).json(createdUser.toUserResponse(true))    
})

export const handleLogin = asyncHandler(async (req, res) => {
    const { credential, password } = req.body

    const user = await UserModel.findOne({
        $or: [
            { username: credential },
            { email: credential }
        ]
    })

    if (!user) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    const match = await bcrypt.compare(password, user.password || '')
    if(match) {
        res.status(200).json(user.toUserResponse(true))
    } else {
        throw new LocalError(ErrKind.UserNotFound, 401)
    }
})


export const getUserInfo = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId)

    if(!user) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    res.status(200).json(user.toUserResponse(false))
})