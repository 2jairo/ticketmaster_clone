import { CategoryStatus } from "./categories";
import { MusicGroupStatus } from "./musicGroupts";
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


export type ConcertStatus = 'ACCEPTED' | 'PENDING' | 'REJECTED'
export const CONCERT_STATUS: ConcertStatus[] = ['ACCEPTED', 'PENDING', 'REJECTED']

export interface AdminDashboardConcertResponse {
  slug: string;
  title: string;
  dateStart: string;
  dateEnd: string;
  description: string;
  images: string[];
  mapImg?: string;
  thumbnailImg?: string;
  locationName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  groups: {
    slug: string;
    title: string;
    image: string;
    status: MusicGroupStatus;
    isActive: boolean;
  }[];
  categories: {
    slug: string;
    title: string;
    status: CategoryStatus;
    isActive: boolean;
  }[];
  tickets: {
    id: string;
    location: string;
    available: number;
    price: number;
    sold: number;
  }[];
  totalTicketsSold: number;
  status: ConcertStatus;
  isActive: boolean;
}

export interface AdminDashboardCreateConcertResponse {
  title: string;
  dateStart: Date;
  dateEnd: Date;
  description: string;
  images?: string[];
  mapImg?: string;
  thumbnailImg?: string;
  locationName: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
	groupSlugs?: string[]
	categorySlugs?: string[]
	status?: ConcertStatus
	isActive?: boolean
}


export type AdminDashboardUpdateConcertResponse = Partial<AdminDashboardCreateConcertResponse>

export const DEFAULT_CONCERT: AdminDashboardConcertResponse = {
  slug: '',
  title: '',
  dateStart: new Date().toISOString(),
  dateEnd: new Date().toISOString(),
  description: '',
  images: [],
  locationName: '',
  location: {
    type: 'Point',
    coordinates: [0, 0]
  },
  groups: [],
  categories: [],
  tickets: [],
  totalTicketsSold: 0,
  status: 'PENDING',
  isActive: true
}
