import { Component, inject, Input } from '@angular/core';
import { ConcertDetailsResponseWrapper } from '../../types/concert';
import { formatViews } from '../../utils/format';
import { ProfileService } from '../../services/profile.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-music-group-card',
  imports: [RouterLink],
  templateUrl: './music-group-card.html'
})
export class MusicGroupCard {
  private profileService = inject(ProfileService)

  @Input({ required: true }) group!: ConcertDetailsResponseWrapper['groups'][0]

  formatFollowers(f: number) {
    return formatViews(f)
  }

  toggleFollow(e: PointerEvent) {
    e.stopPropagation()

    this.profileService.setFollowGroup(this.group.slug, !this.group.following)
      .subscribe({
        next: () => {
          this.group.following = !this.group.following
          this.group.followers += this.group.following ? 1 : -1
        },
        error: () => {
          //TODO
        }
      })
  }
}
