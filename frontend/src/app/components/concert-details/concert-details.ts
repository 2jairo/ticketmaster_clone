import { AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConcertsService } from '../../services/concerts.service';
import { ConcertDetailsResponseWrapper } from '../../types/concert';
import { ConcertTicketCard } from './concert-ticket-card';
import { Carousel } from "../carousel/carousel";

type Sections = 'tickets' | 'description'

@Component({
  selector: 'app-concert-details',
  imports: [ConcertTicketCard, RouterLink, Carousel],
  templateUrl: './concert-details.html'
})
export class ConcertDetails implements OnInit, AfterViewInit {
  route = inject(ActivatedRoute)
  router = inject(Router)
  concertApiService = inject(ConcertsService)

  concert!: ConcertDetailsResponseWrapper

  currentSection: Sections = 'tickets'
  @ViewChild('tickets') ticketsSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('description') descriptionSectionElmt!: ElementRef<HTMLElement>

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug']

    this.concertApiService.getConcertDetails(slug).subscribe({
      next: (c) => {
        this.concert = c
      }
    })
  }

  ngAfterViewInit(): void {
    this.updateCurrentSection()
  }

  scrollTo(section: Sections) {
    const elmt = section === 'description'
      ? this.descriptionSectionElmt
      : this.ticketsSectionElmt

    elmt.nativeElement.scrollIntoView()
    this.currentSection = section
  }

  calculateCurrentSectionDistance(elmt: ElementRef<HTMLElement>) {
    const rect = elmt.nativeElement.getBoundingClientRect()
    return Math.abs((rect.top + rect.height / 2) - (window.innerHeight / 1.5))
  }

  @HostListener('window:load')
  @HostListener('window:resize')
  @HostListener('window:scroll')
  updateCurrentSection() {
    if(!this.ticketsSectionElmt || !this.descriptionSectionElmt) {
      return
    }

    const distances: [Sections, number][] = [
      ['tickets', this.calculateCurrentSectionDistance(this.ticketsSectionElmt)],
      ['description', this.calculateCurrentSectionDistance(this.descriptionSectionElmt)],
    ]

    this.currentSection = distances.reduce((a, b) => a[1] < b[1] ? a : b)[0]
  }
}
