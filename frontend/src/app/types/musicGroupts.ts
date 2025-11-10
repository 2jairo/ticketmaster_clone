export interface MusicGroupResponse {
  title: string
  slug: string
  image: string
  followers: number
  following: boolean
}

export type MusicGroupStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING'
export const MUSIC_GROUP_STATUS: MusicGroupStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING']
export const DEFAULT_MUSIC_GROUP: AdminDashboardMusicGroupResponse = {
  concerts: 0,
  description: '',
  followers: 0,
  image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  isActive: true,
  slug: '',
  status: 'PENDING',
  title: ''
}

export interface AdminDashboardMusicGroupResponse {
  slug: string;
  image: string;
  followers: number;
  title: string;
  description: string;
  status: MusicGroupStatus
  isActive: boolean
  concerts: number
}

export interface AdminDashboardUpdateMusicGroupBody {
  title?: string
  image?: string
  description?: string
  status?: MusicGroupStatus
  isActive?: boolean
}

export interface AdminDashboardCreateMusicGroupBody {
	title: string
	image?: string
	description?: string
	status?: MusicGroupStatus
  isActive?: boolean
}
