export interface MusicGroupResponse {
  title: string
  slug: string
  image: string
  followers: number
  following: boolean
}

export interface AdminDashboardMusicGroupResponse {
  slug: string;
  image: string;
  followers: number;
  title: string;
  description: string;
}
