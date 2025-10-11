import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import bcrypt from 'bcrypt'



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
        res.status(404).json({message: "User Not Found"})
        return
    }

    const match = await bcrypt.compare(password, user.password || '')
    if(match) {
        res.status(200).json(user.toUserResponse(true))
    } else {
        res.status(401).json({
            error: 'test'
        })
    }
})


export const getUserInfo = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.userId)

    if(!user) {
        res.status(404).json({
            error: 'error'
        })
    } else {
        res.status(200).json(user.toUserResponse(false))
    }
})