import { MusicGroupResponse } from "./musicGroupts"

export interface CommentAuthorResponse {
  username: string
  image: string
  following: boolean
  followers: number
}

export interface UserProfileResponse {
  username: string
  image: string
  following: boolean
  followers: number
  myProfile: boolean
  commonFollowingGroups: MusicGroupResponse[],
  commonFollowingUsers: CommentAuthorResponse[]
}
