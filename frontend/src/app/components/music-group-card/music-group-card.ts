import { Component, inject, Input } from '@angular/core';
import { formatViews } from '../../utils/format';
import { ProfileService } from '../../services/profile.service';
import { RouterLink } from "@angular/router";
import { MusicGroupResponse } from '../../types/musicGroupts';
import { JwtService } from '../../services/jwt.service';

@Component({
  selector: 'app-music-group-card',
  imports: [RouterLink],
  templateUrl: './music-group-card.html'
})
export class MusicGroupCard {
  private jwtService = inject(JwtService)
  private profileService = inject(ProfileService)

  @Input({ required: true }) group!: MusicGroupResponse

  formatFollowers(f: number) {
    return formatViews(f)
  }

  toggleFollow(e: PointerEvent) {
    e.stopPropagation()

    if(this.jwtService.checkIfLogged()) {
      return
    }

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
