import { inject, Injectable } from '@angular/core';
import { HttpApiService } from './httpApi.service';
import { environment } from '../../environments/environment';
import { Pagination } from '../types/filters';
import { createCommentResponseWrapper, RawCommentResponse } from '../types/comments';
import { map } from 'rxjs';
import { UserProfileResponse } from '../types/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpApiService)

  getUserProfile(username: string) {
    return this.http.get<UserProfileResponse>(environment.USER_API_URL, `/profile/${username}`)
  }

  setFollowGroup(groupSlug: string, newValue: boolean) {
    const params = { newValue }
    return this.http.post<void>( environment.USER_API_URL, `/profile/follow/group/${groupSlug}`, undefined, { params })
  }

  setFollowUser(username: string, newValue: boolean) {
    const params = { newValue }
    return this.http.post<void>( environment.USER_API_URL, `/profile/follow/user/${username}`, undefined, { params })
  }

  setLikeComment(commentId: string, newValue: boolean) {
    const params = { newValue }
    return this.http.post<void>(environment.USER_API_URL, `/comments/like/${commentId}`, undefined, { params })
  }

  getConcertComments(slug: string, pagination: Pagination) {
    const params = { ...pagination }
    return this.http.get<RawCommentResponse[]>(environment.USER_API_URL, `/comments/${slug}`, { params }).pipe(map((c) => {
      return c.map((cc) => createCommentResponseWrapper(cc))
    }))
  }

  createComment(concertSlug: string, comment: string) {
    return this.http.post<RawCommentResponse>(environment.USER_API_URL, `/comments/create/${concertSlug}`, { comment }).pipe(map((c) => {
      return createCommentResponseWrapper(c)
    }))
  }

  deleteComment(concertSlug: string, commentId: string) {
    return this.http.delete<void>(environment.USER_API_URL, `/comments/${concertSlug}/${commentId}`)
  }
}
