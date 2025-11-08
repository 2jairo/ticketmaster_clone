import { UserRole } from "./userAuth";

export interface AdminDashboardUserResponse {
  username: string;
  email: string;
  image: string;
  role: UserRole;
  isActive: boolean;
  followers: number;
  followingGroupsLength: number
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
