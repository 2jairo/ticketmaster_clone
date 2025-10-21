import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator'

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
    followingGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicGroup'
    }],
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})


userSchema.plugin(uniqueValidator)


userSchema.methods.generateAccessToken = function() {
    const payload = {
        "userId": this._id,
        "v": this.__v
    }

    return jwt.sign(payload, process.env.JWT_SECRET!,{ expiresIn: "1d" })
}

userSchema.methods.toUserResponse = function(withToken: boolean) {
    return {
        username: this.username,
        email: this.email,
        image: this.image,
        ...(withToken ? { token: this.generateAccessToken() } : {})
    }
}

userSchema.methods.toProfileResponse = function(user?: IUserModel) {
    return {
        username: this.username,
        image: this.image,
        following: user ? user.isFollowingUser(this._id) : false
    }
}

userSchema.methods.isFollowingUser = function(userId: mongoose.Types.ObjectId) {
    const idStr = userId.toString()
    for (const u of this.followingUsers) {
        if(u.toString() === idStr) {
            return true
        }
    }
    return false
}

userSchema.methods.isFollowingGroup = function(groupId: mongoose.Types.ObjectId) {
    const idStr = groupId.toString()
    for (const g of this.followingGroups) {
        if(g.toString() === idStr) {
            return true
        }
    }
    return false
}

userSchema.methods.setGroupFollow = function(groupId: mongoose.Types.ObjectId, newValue: boolean) {
    const idStr = groupId.toString();

    const alreadyFollowing = this.followingGroups.some((g: mongoose.Types.ObjectId) => g.toString() === idStr);

    if (newValue) {
        if (!alreadyFollowing) {
            this.followingGroups.push(groupId);
            return 1;
        }
    } else {
        if (alreadyFollowing) {
            this.followingGroups = this.followingGroups.filter((g: mongoose.Types.ObjectId) => g.toString() !== idStr);
            return -1;
        }
    }
    return 0;
}

userSchema.methods.setUserFollow = function(userId: mongoose.Types.ObjectId, newValue: boolean) {
    const idStr = userId.toString()

    const alreadyFollowing = this.followingUsers.some((u: mongoose.Types.ObjectId) => u.toString() === idStr);

    if (newValue) {
        if (!alreadyFollowing) {
            this.followingUsers.push(userId);
            return 1;
        }
    } else {
        if (alreadyFollowing) {
            this.followingUsers = this.followingUsers.filter((u: mongoose.Types.ObjectId) => u.toString() !== idStr);
            return -1;
        }
    }
    return 0;
}

export interface IUserModel {
    toUserResponse(withToken: boolean): any
    toProfileResponse(user?: IUserModel): any
    generateAccesToken(): void
    isFollowingUser(userId: mongoose.Types.ObjectId): boolean
    isFollowingGroup(groupId: mongoose.Types.ObjectId): boolean
    setGroupFollow(groupId: mongoose.Types.ObjectId, newValue: boolean): number
    setUserFollow(userId: mongoose.Types.ObjectId, newValue: boolean): number

    password?: string
    _id?: mongoose.Types.ObjectId
}

export const UserModel = mongoose.model<IUserModel>('User', userSchema);
