import { Component, EventEmitter, Input, Output } from "@angular/core"
import { ConcertDetailsResponseWrapper } from "../../types/concert"
import { formatViews } from "../../utils/format"

@Component({
  selector: 'app-concert-details-ticket-card',
  imports: [],
  templateUrl: './concert-ticket-card.html'
})
export class ConcertTicketCard {
  @Input({ required: true }) quantity!: number
  @Input({ required: true }) currentTicket!: ConcertDetailsResponseWrapper['tickets'][0]
  @Output() onUpdateQuantity = new EventEmitter<{ itemId: string, quantity: number }>()

  updateQuantity(newQuantity: number) {
    this.onUpdateQuantity.emit({ itemId: this.currentTicket._id, quantity: newQuantity })

    // if (newQuantity < 1) {
    //   this.removeItem()
    //   return
    // }

    // this.cartService.updateCart({
    //   merch: [{
    //     itemId: this.currentTicket._id,
    //     quantity: newQuantity
    //   }]
    // })
  }

  formatViews(n: number) {
    return formatViews(n)
  }
}
