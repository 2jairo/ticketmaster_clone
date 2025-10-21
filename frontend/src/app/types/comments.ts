import { formatDate } from "../utils/format"

export interface RawCommentResponse {
  id: string
  comment: string
  createdAt: string
  owner: boolean
  liked: boolean
  author: {
    username: string
    image: string
    following: boolean
  }
}

export type CommentResponseWrapper = ReturnType<typeof createCommentResponseWrapper>

export const createCommentResponseWrapper = (rawComment: RawCommentResponse) => {
  const c = {
    ...rawComment,
    createdAt: new Date(rawComment.createdAt),
  }

  return {
    ...c,
    createdAt: formatDate(c.createdAt)
  }
}
