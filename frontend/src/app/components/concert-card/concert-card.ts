import { Component, inject, Input } from '@angular/core';
import type { ConcertResponseWrapper } from '../../types/concert';
import { Router, RouterLink } from '@angular/router';
import { Carousel } from "../carousel/carousel";
import { formatViews, shortenDescription } from '../../utils/format';

@Component({
  selector: 'app-concert-card',
  imports: [RouterLink, Carousel],
  templateUrl: './concert-card.html'
})
export class ConcertCard {
  @Input({ required: true }) concert!: ConcertResponseWrapper

  router = inject(Router)

  formatCarouselImages() {
    return this.concert.images.carousel.map((src) => ({ src }))
  }

  formatViews(n: number) {
    return formatViews(n)
  }

  shortenDescription(desc: string, size: number) {
    return shortenDescription(desc, size)
  }
}
