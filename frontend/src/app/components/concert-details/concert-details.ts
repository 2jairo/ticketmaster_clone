import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConcertDetailsResponseWrapper } from '../../types/concert';
import { ConcertTicketCard } from './concert-ticket-card';
import { Carousel } from "../carousel/carousel";
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'


type Sections = 'tickets' | 'description'

@Component({
  selector: 'app-concert-details',
  imports: [ConcertTicketCard, RouterLink, Carousel],
  templateUrl: './concert-details.html'
})
export class ConcertDetails implements AfterViewInit {
  @Input({ required: true }) concert!: ConcertDetailsResponseWrapper

  currentSection: Sections = 'tickets'
  @ViewChild('tickets') ticketsSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('description') descriptionSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('location') leafletMapElmt!: ElementRef<HTMLElement>

  ngAfterViewInit(): void {
    this.updateCurrentSection()
    this.setupLeafletMap()
  }

  setupLeafletMap() {
    const [lat, lng] = this.concert.location.coordinates
    const map = L.map(this.leafletMapElmt.nativeElement)
      .setView([lat, lng], 15)
      .addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }))

    map.zoomControl.remove()
    L.marker([lat, lng]).addTo(map);
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
