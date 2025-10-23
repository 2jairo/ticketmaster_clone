import { Component, inject, Input } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { RouterLink } from '@angular/router';
import { CommentAuthorResponse } from '../../types/profile';
import { formatViews } from '../../utils/format';

@Component({
  selector: 'app-username-card',
  imports: [RouterLink],
  templateUrl: './username-card.html'
})
export class UsernameCard {
  private profileService = inject(ProfileService)

  @Input({ required: true }) user!: CommentAuthorResponse

  formatFollowers(f: number) {
    return formatViews(f)
  }

  toggleFollow(e: PointerEvent) {
    e.stopPropagation()

    this.profileService.setFollowUser(this.user.username, !this.user.following)
      .subscribe({
        next: () => {
          this.user.following = !this.user.following
          this.user.followers += this.user.following ? 1 : -1
        },
        error: () => {
          //TODO
        }
      })
  }
}
