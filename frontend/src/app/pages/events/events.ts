import { Component } from '@angular/core';
import { ConcertList } from "../../components/concert-list/concert-list";

@Component({
  selector: 'app-events',
  imports: [ConcertList],
  templateUrl: './events.html'
})
export class Events {

}
