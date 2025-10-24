import asyncHandler from "express-async-handler";
import { UserModel } from "../models/user";
import bcrypt from 'bcrypt'
import { ErrKind, LocalError } from "../error/err";
import { authenticateRefreshToken, generateAccesToken, generateRefreshTokenCookie, REFRESH_TOKEN_COOKIE } from "../utils/jwt";


export const refreshAccessToken = asyncHandler(async (req, res, next) => {
    const refresh = req.cookies[REFRESH_TOKEN_COOKIE]
    if(!refresh) {
        throw new LocalError(ErrKind.ExpiredRefreshToken, 401)
    }

    const claims = await authenticateRefreshToken(refresh)
    const newAccess = generateAccesToken(claims)
    res.status(200).json({ token: newAccess })
})

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie(REFRESH_TOKEN_COOKIE, { 
        sameSite: 'none',
        httpOnly: true,
        path: '/',
        secure: true
    })
    //TODO: blacklist
    res.status(200).json()
})


export const handleSignin = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new UserModel({
        username,
        email,
        password: hashedPassword
    })

    const createdUser = await user.save()

    generateRefreshTokenCookie(createdUser.getJwtClaims(), res)
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
        generateRefreshTokenCookie(user.getJwtClaims(), res)
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

export const updateUserInfo = asyncHandler(async (req, res) => {
    const updatedUser = await UserModel.findByIdAndUpdate(req.userId, req.body.password, { new: true })

    if (!updatedUser) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    generateRefreshTokenCookie(updatedUser.getJwtClaims(), res)
    res.status(200).json(updatedUser.toUserResponse(true))
})

export const updateUserPassword = asyncHandler(async (req, res) => {
    const { new: newPassword, old: oldPassword } = req.body

    const user = await UserModel.findById(req.userId)
    if (!user) {
        throw new LocalError(ErrKind.UserNotFound, 404)
    }

    const match = await bcrypt.compare(oldPassword, user.password || '')
    if(match) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        const updatedUser = await user.save()
        
        generateRefreshTokenCookie(updatedUser.getJwtClaims(), res)
        res.status(200).json(updatedUser.toUserResponse(true))
    } else {
        throw new LocalError(ErrKind.PasswordMismatch, 401)
    }
})