import { Component, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Pagination } from '../../categories/filters';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { AdminDashboardMusicGroupResponse } from '../../../types/musicGroupts';
import { AdminMusicGroupCard } from './admin-music-group-card';

@Component({
  selector: 'app-music-groups',
  imports: [InfiniteScrollDirective, AdminMusicGroupCard],
  templateUrl: './music-groups.html',
})
export class MusicGroups implements OnInit {
  private adminsService = inject(AdminsService)
  musicGroups = signal<AdminDashboardMusicGroupResponse[]>([])

  ngOnInit(): void {
    this.loadMusicGroups()
  }

  pagination: Pagination = {
    offset: 0,
    size: environment.ADMIN_DASHBOARD_MUSIC_GROUPS_PAGE_SIZE
  }

  loading = false
  allLoaded = false
  loadMusicGroups() {
    if (this.loading || this.allLoaded) return

    this.loading = true
    this.adminsService.getMusicGroupList(this.pagination).subscribe({
      next: (newGroups) => {
        if (newGroups.length === 0) {
          this.allLoaded = true
        } else {
          this.musicGroups.update((prev) => [...prev, ...newGroups])
          this.pagination.offset += newGroups.length
        }
      },
      complete: () => this.loading = false
    })
  }

  updateUser({ slug, newGroup }: { slug: string, newGroup: AdminDashboardMusicGroupResponse }) {
    this.musicGroups.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy[idx] = newGroup
      return copy
    })
  }

  deleteMusicGroup({ slug }: { slug: string }) {
    this.musicGroups.update(prev => {
      const idx = prev.findIndex(u => u.slug === slug)
      if (idx === -1) return prev

      const copy = prev.slice()
      copy.splice(idx, 1)
      if (this.pagination.offset > 0) this.pagination.offset -= 1

      return copy
    })
  }

}
