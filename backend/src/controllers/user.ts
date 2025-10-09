import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import bcrypt from 'bcrypt'



export const handleRegister = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new UserModel({
        username,
        email,
        password: hashedPassword
    })

    const createdUser = await user.save()
    res.status(200).json(createdUser.toUserResponse())    
})

export const handleLogin = asyncHandler(async (req, res) => {
    const { credentials, password } = req.body

    const user = await UserModel.findOne({
        $or: [
            { username: credentials },
            { email: credentials }
        ]
    })

    if (!user) {
        res.status(404).json({message: "User Not Found"})
        return
    }

    const match = await bcrypt.compare(user.password || '', password)
    if(match) {
        res.status(200).json({
            user: user.toUserResponse()
        })
    } else {
        res.status(200).json({
            error: 'test'
        })
    }
})
