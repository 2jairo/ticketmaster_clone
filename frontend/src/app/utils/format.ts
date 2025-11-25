import { CategoryStatus } from "../types/categories"
import { MusicGroupStatus } from "../types/musicGroupts"
import { UserRole } from "../types/userAuth"

export const formatViews = (views: number) => {
  if (views >= 1_000_000) return (views / 1_000_000).toFixed(0) + 'M'
  if (views >= 1_000) return (views / 1_000).toFixed(0) + 'K'
  return views
}

export const shortenDescription = (desc: string, size: number) => {
  if (desc.length > size) {
    return desc.slice(0, size) + ' ...'
  }
  return desc
}

export const getTimeAgo = (date: Date) => {
  const minsSinceDate = (Date.now() - date.getTime()) / (1000 * 60)

  const formatIfSingular = (num: number, format: string) => {
    return `${num} ${format}${num === 1 ? '' : 's'} ago`
  }

  if (minsSinceDate < 1) {
    return 'Now';
  } else if (minsSinceDate < 60) {
    return formatIfSingular(Math.floor(minsSinceDate), 'minute');
  } else if (minsSinceDate < 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / 60), 'hour')
  } else if (minsSinceDate < 30 * 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / (24 * 60)), 'day')
  } else if (minsSinceDate < 12 * 30 * 24 * 60) {
    return formatIfSingular(Math.floor(minsSinceDate / (30 * 24 * 60)), 'month')
  }

  return formatIfSingular(Math.floor(minsSinceDate / (12 * 30 * 24 * 60)), 'year')
}

export const formatDate = (date: Date, splitter = '/') => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()

  return `${day}${splitter}${month}${splitter}${year}`
}

export const getTimeAgoMin = (date: Date) => {
  const minsSinceDate = (Date.now() - date.getTime()) / (1000 * 60)

  if (minsSinceDate < 1) {
    return 'Now';
  } else if (minsSinceDate < 60) {
    return Math.floor(minsSinceDate) + 'min'
  } else if (minsSinceDate < 24 * 60) {
    return Math.floor(minsSinceDate / 60) + 'h'
  } else if (minsSinceDate < 30 * 24 * 60) {
    return Math.floor(minsSinceDate / (24 * 60)) + 'd'
  } else if (minsSinceDate < 12 * 30 * 24 * 60) {
    return Math.floor(minsSinceDate / (30 * 24 * 60)) + 'm'
  }

  return Math.floor(minsSinceDate / (12 * 30 * 24 * 60)) + 'y'
}

export const formatUserRole = (r: UserRole) => {
  if (r === 'ADMIN') return 'Administrator'
  if (r === 'ROOT') return 'Super Administrator'
  if (r === 'ENTERPRISE') return 'Enterprise'
  return 'Client'
}

export const formatMusicGroupStatus = (s: MusicGroupStatus) => {
  if(s === 'ACCEPTED') return 'Accepted'
  if(s === 'REJECTED') return 'Rejected'
  return 'Pending'
}

export const formatCategoryStatus = (s: CategoryStatus) => {
  if(s === 'ACCEPTED') return 'Accepted'
  if(s === 'REJECTED') return 'Rejected'
  return 'Pending'
}

export const formatConcertStatus = (s: 'ACCEPTED' | 'PENDING' | 'REJECTED') => {
  if(s === 'ACCEPTED') return 'Accepted'
  if(s === 'REJECTED') return 'Rejected'
  return 'Pending'
}
