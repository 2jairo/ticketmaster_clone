import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index: true
    },
    image: {
        type: String,
        default: "https://static.productionready.io/images/smiley-cyrus.jpg"
    },
    // favouriteArticles: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Article'
    // }],
    // followingUsers: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }]
})


userSchema.methods.generateAccessToken = function() {
    const payload = {
        "user": {
            "id": this._id,
            "email": this.email,
            "password": this.password
        }
    }

    return jwt.sign(payload, process.env.JWT_SECRET!,{ expiresIn: "1d" })
}

userSchema.methods.toUserResponse = function() {
    return {
        username: this.username,
        email: this.email,
        image: this.image,
        token: this.generateAccessToken()
    }
}

interface IUserModel {
    toUserResponse(): void

    password?: string
}

export const UserModel = mongoose.model<IUserModel>('User', userSchema);
