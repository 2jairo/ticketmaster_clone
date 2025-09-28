import { Component } from '@angular/core';
import { ConcertDetails } from "../../components/concert-details/concert-details";

@Component({
  selector: 'app-details',
  imports: [ConcertDetails],
  templateUrl: './details.html'
})
export class Details {

}
