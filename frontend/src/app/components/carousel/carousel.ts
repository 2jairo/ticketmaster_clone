import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, Input, ViewChild } from '@angular/core';
import type { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-carousel',
  imports: [],
  templateUrl: './carousel.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Carousel implements AfterViewInit {
  @Input() background: '#000' | 'var(--pico-form-element-background-color)' = 'var(--pico-form-element-background-color)'
  @Input() aspectRatio = '16/9'

  @Input({ required: true }) images: string[] = [
    // "https://media.architecturaldigest.com/photos/66a914f1a958d12e0cc94a8e/16:9/w_1280,c_limit/DSC_5903.jpg?mbid=social_retweet",
    // "https://www.carpro.com/hs-fs/hubfs/2023-Chevrolet-Corvette-Z06-credit-chevrolet.jpeg?width=1020&name=2023-Chevrolet-Corvette-Z06-credit-chevrolet.jpeg",
    // "https://i.abcnewsfe.com/a/f43853f3-9eaf-4048-9ae7-757332c5787e/mclaren-1-ht-gmh-240412_1712928561648_hpMain_16x9.jpg?w=1600",
    // "https://etimg.etb2bimg.com/photo/61543962.cms"
  ]

  @ViewChild('swiper') swiperElmt!: ElementRef<any>
  @ViewChild('next') navigationNextElmt!: ElementRef<HTMLDivElement>
  @ViewChild('prev') navigationPrevElmt!: ElementRef<HTMLDivElement>

  ngAfterViewInit(): void {
    const options: SwiperOptions = {
      slidesPerView: 1,
      autoplay: {
        delay: 3000
      },
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
