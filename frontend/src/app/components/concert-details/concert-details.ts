import { AfterViewInit, Component, ElementRef, HostListener, inject, Input, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConcertDetailsResponseWrapper } from '../../types/concert';
import { ConcertTicketCard } from './concert-ticket-card';
import { Carousel } from "../carousel/carousel";
import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { MusicGroupCard } from "./music-group-card";
import { CommentList } from '../comment-list/comment-list';
import { Pagination } from '../categories/filters';
import { ProfileService } from '../../services/profile.service';


type Sections = 'groups' | 'tickets' | 'description' | 'comments'

@Component({
  selector: 'app-concert-details',
  imports: [ConcertTicketCard, RouterLink, Carousel, MusicGroupCard, CommentList],
  templateUrl: './concert-details.html'
})
export class ConcertDetails implements AfterViewInit {
  @Input({ required: true }) concert!: ConcertDetailsResponseWrapper
  private profileService = inject(ProfileService)

  currentSection: Sections = 'groups'
  @ViewChild('tickets') ticketsSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('description') descriptionSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('musicGroups') groupsSectionElmt!: ElementRef<HTMLElement>
  @ViewChild('comments') commentsSectionElmt!: ElementRef<HTMLElement>

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
    const elmts = {
      groups: this.groupsSectionElmt,
      tickets: this.ticketsSectionElmt,
      description: this.descriptionSectionElmt,
      comments: this.commentsSectionElmt
    }

    elmts[section].nativeElement.scrollIntoView()
    this.currentSection = section
  }

  getComments = (p: Pagination) => {
    return this.profileService.getConcertComments(this.concert.slug, p)
  }

  calculateCurrentSectionDistance(elmt: ElementRef<HTMLElement>) {
    const rect = elmt.nativeElement.getBoundingClientRect()
    return Math.abs((rect.top + rect.height / 2) - (window.innerHeight / 1.5))
  }

  @HostListener('window:load')
  @HostListener('window:resize')
  @HostListener('window:scroll')
  updateCurrentSection() {
    if(!this.ticketsSectionElmt || !this.descriptionSectionElmt || !this.groupsSectionElmt) {
      return
    }

    const distances: [Sections, number][] = [
      ['groups', this.calculateCurrentSectionDistance(this.groupsSectionElmt)],
      ['tickets', this.calculateCurrentSectionDistance(this.ticketsSectionElmt)],
      ['description', this.calculateCurrentSectionDistance(this.descriptionSectionElmt)],
      ['comments', this.calculateCurrentSectionDistance(this.commentsSectionElmt)],
    ]

    this.currentSection = distances.reduce((a, b) => a[1] < b[1] ? a : b)[0]
  }
}
