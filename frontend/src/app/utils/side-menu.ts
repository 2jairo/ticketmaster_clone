import { inject, signal } from "@angular/core"
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router"
import { filter } from "rxjs"

export class SideMenuSections {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  sectionAll = signal('')
  section = signal('')

  constructor(private defaultRoute: string) {}

  init(): void {
    this.setSectionFromRoute()

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.setSectionFromRoute()
      })
  }

  private setSectionFromRoute() {
    const child = this.route.firstChild

    if (child && child.snapshot.url.length > 0) {
      const segment = child.snapshot.url.map(p => p.path)

      this.sectionAll.set(segment.join('/'))
      this.section.set(segment[0])
    } else {
      this.sectionAll.set(this.defaultRoute)
      this.section.set(this.defaultRoute)
    }
  }
}
