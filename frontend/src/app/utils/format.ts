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

export const formatDate = (date: Date) => {
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

export const formatDateMin = (date: Date) => {
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
