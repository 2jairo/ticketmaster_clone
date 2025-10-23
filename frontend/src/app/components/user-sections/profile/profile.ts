import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../../services/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileResponse } from '../../../types/profile';
import { formatViews } from '../../../utils/format';
import { MusicGroupCard } from '../../music-group-card/music-group-card';
import { UsernameCard } from '../../username-card/username-card';

@Component({
  selector: 'app-profile',
  imports: [MusicGroupCard, UsernameCard],
  templateUrl: './profile.html'
})
export class Profile implements OnInit {
  private profileService = inject(ProfileService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  profile: UserProfileResponse | null = null

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const username = params.get('username')!

      this.profileService.getUserProfile(username).subscribe({
        next: (p) => {
          this.profile = p
        },
        error: () => this.router.navigate(['/'])
      })
    });
  }

  toggleUserFollow() {
    if(!this.profile || this.profile.myProfile) {
      return
    }

    this.profileService.setFollowUser(this.profile.username, !this.profile.following).subscribe({
      next: () => {
        this.profile!.following = !this.profile!.following
        this.profile!.followers += this.profile!.following ? 1 : -1
      },
      error: () => {
        //TODO
      }
    })
  }

  formatFollows(n: number) {
    return formatViews(n)
  }
}
