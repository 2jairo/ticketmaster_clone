import { AdminDashboardMusicGroupResponse } from "./musicGroupts";
import { LoginSigninResponse, UserRole } from "./userAuth";

export interface AdminDashboardUserResponse {
  username: string;
  email: string;
  image: string;
  role: UserRole;
  isActive: boolean;
  followers: number;
  followingGroups: AdminDashboardMusicGroupResponse[]
  followingGroupsLength: number
  followingUsers: LoginSigninResponse[]
  followingUsersLength: number
}

export interface AdminDashboardUpdateUserBody {
  username?: string;
  email?: string;
  password?: string
  image?: string;
  role?: UserRole;
  isActive?: boolean;
}
