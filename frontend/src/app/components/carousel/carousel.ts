import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import type { SwiperOptions } from 'swiper/types';

type Images = {
  navigateTo?: string
  title?: string
  src: string
}

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Carousel implements AfterViewInit {
  @Input() background: '#000' | 'var(--pico-form-element-background-color)' = 'var(--pico-form-element-background-color)'
  @Input() aspectRatio = '16/9'

  @Input({ required: true }) images!: Images[]

  @ViewChild('swiper') swiperElmt!: ElementRef<any>
  @ViewChild('next') navigationNextElmt!: ElementRef<HTMLDivElement>
  @ViewChild('prev') navigationPrevElmt!: ElementRef<HTMLDivElement>

  ngAfterViewInit(): void {
    const options: SwiperOptions = {
      slidesPerView: 1,
      autoplay: {
        delay: 3000
      },
      modules: [Pagination, Navigation, Autoplay],
      navigation: {
        nextEl: this.navigationNextElmt.nativeElement,
        prevEl: this.navigationPrevElmt.nativeElement,
        enabled: true,
      },
      loop: true,
      pagination: { clickable: true },
    }

    Object.assign(this.swiperElmt.nativeElement, options)
    this.swiperElmt.nativeElement.initialize()
  }
}
