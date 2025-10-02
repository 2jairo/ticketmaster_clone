import { Component, Input } from "@angular/core"
import { ConcertDetailsResponseWrapper } from "../../types/concert"
import { formatViews } from "../../utils/format"

@Component({
  selector: 'app-concert-details-ticket-card',
  imports: [],
  templateUrl: './concert-ticket-card.html'
})
export class ConcertTicketCard {
  @Input({ required: true }) concert!: ConcertDetailsResponseWrapper
  @Input({ required: true }) currentTicket!: ConcertDetailsResponseWrapper['tickets'][0]

  ammount = 0

  updateAmmount(offset: number) {
    this.ammount = Math.max(0, this.ammount + offset)
  }

  formatViews(n: number) {
    return formatViews(n)
  }
}
