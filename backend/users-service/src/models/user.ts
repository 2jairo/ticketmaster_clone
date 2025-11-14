import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'
import { MusicGroupModel } from './musicGroup';
import { USER_ROLES, UserRole, type AccesTokenClaims } from '../utils/jwt';

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
    }],
    followers: {
        type: Number,
        required: true,
        default: 0
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true
    },
    role: {
        type: String,
        enum: USER_ROLES,
        required: true,
        default: 'CLIENT'
    }
})


userSchema.plugin(uniqueValidator)

userSchema.methods.getJwtClaims = function(): AccesTokenClaims {
    return { userId: this._id.toString(), v: this.__v, role: this.role }
}


userSchema.pre(/^find/, function() {
    //@ts-ignore
    this.where({ isActive: true });
})

userSchema.methods.toCommentAuthorResponse = function(user?: IUserModel) {
    return {
        username: this.username,
        image: this.image,
        following: user ? user.isFollowingUser(this._id) : false,
        followers: this.followers
    }
}

userSchema.methods.toProfileResponse = async function(user?: IUserModel, currentUserId?: string) {
    const myProfile = this._id?.toString() === currentUserId
    
    let commonFollowingGroups = []
    let commonFollowingUsers = []

    if(user && !myProfile) {
        const commonUsers = this.commonFollowingUsers(user)
        if(commonUsers.length) {
            commonFollowingUsers = (await UserModel.find({ _id: { $in: commonUsers } }))
                .map((u) => u.toCommentAuthorResponse(user))
        }

        const commonGroups = this.commonFollowingGroups(user)
        if (commonGroups.length) {
            commonFollowingGroups = (await MusicGroupModel.find({ _id: { $in: commonGroups } }))
                .map((g) => g.toMusicGroupConcertDetailsResponse(user));
        }
    }

    return {
        username: this.username,
        image: this.image,
        following: user ? user.isFollowingUser(this._id) : false,
        followers: this.followers,
        myProfile,    
        commonFollowingGroups,
        commonFollowingUsers,
    }
}

userSchema.methods.commonFollowingGroups = function(user: IUserModel) {
    const userFollowingGroups = new Set(user.followingGroups.map((g: mongoose.Types.ObjectId) => g.toString()));
    return this.followingGroups.filter((g: mongoose.Types.ObjectId) => userFollowingGroups.has(g.toString()));
}

userSchema.methods.commonFollowingUsers = function(user: IUserModel) {
    const userFollowingUsers = new Set(user.followingUsers.map((u: mongoose.Types.ObjectId) => u.toString()));
    return this.followingUsers.filter((u: mongoose.Types.ObjectId) => userFollowingUsers.has(u.toString()));
}

// userSchema.methods.toProfileResponse = async function(user?: IUserModel, currentUserId?: string) {
//     const myProfile = this._id?.toString() === currentUserId

//     if(myProfile) {
//         await this.populate('followingGroups')
//         await this.populate('followingUsers')
//     }

//     return {
//         username: this.username,
//         image: this.image,
//         following: user ? user.isFollowingUser(this._id) : false,
//         followers: this.followers,
//         myProfile,
//         myProfileInfo: myProfile
//             ? {
//                 followingGroups: this.followingGroups.map((g: IMusicGroupModel) => g.toMusicGroupConcertDetailsResponse(user)),
//                 followingUsers: this.followingUsers.map((u: IUserModel) => u.toCommentAuthorResponse(user))
//             }
//             : null
//     }
// }

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

userSchema.methods.updateFollowers = function(offset: number) {
    this.followers += offset
}

export interface IUserModel {
    getJwtClaims(): AccesTokenClaims
    toProfileResponse(user?: IUserModel, currentUserId?: string): Promise<any>
    toCommentAuthorResponse(user?: IUserModel): any
    isFollowingUser(userId: mongoose.Types.ObjectId): boolean
    isFollowingGroup(groupId: mongoose.Types.ObjectId): boolean
    setGroupFollow(groupId: mongoose.Types.ObjectId, newValue: boolean): number
    setUserFollow(userId: mongoose.Types.ObjectId, newValue: boolean): number
    updateFollowers(offset: number): void

    password?: string
    followingGroups: mongoose.Types.ObjectId[]
    followingUsers: mongoose.Types.ObjectId[]
    _id?: mongoose.Types.ObjectId
    role: UserRole
}

export const UserModel = mongoose.model<IUserModel>('User', userSchema);
