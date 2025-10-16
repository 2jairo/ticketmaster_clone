import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-show-error',
  imports: [],
  templateUrl: './show-error.html'
})
export class ShowError {
  @Input({ required: true }) error!: string
  @Input() generalError = false
  @Input() icon = "fa-solid fa-circle-exclamation"
}
