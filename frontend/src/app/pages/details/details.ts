import { Component, inject } from '@angular/core';
import { ConcertDetails } from "../../components/concert-details/concert-details";
import { ActivatedRoute } from '@angular/router';
import { ConcertsService } from '../../services/concerts.service';
import { ConcertDetailsResponseWrapper } from '../../types/concert';
import { LoadingGif } from "../../components/loading-gif/loading-gif";

@Component({
  selector: 'app-details',
  imports: [ConcertDetails, LoadingGif],
  templateUrl: './details.html'
})
export class Details {
  private route = inject(ActivatedRoute)
  private concertApiService = inject(ConcertsService)

  concert?: ConcertDetailsResponseWrapper

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug']

    this.concertApiService.getConcertDetails(slug).subscribe({
      next: (c) => {
        this.concert = c
      }
    })
  }
}
