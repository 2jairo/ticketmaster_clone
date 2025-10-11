import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-show-password',
  imports: [],
  templateUrl: './show-password.html'
})
export class ShowPassword {
  @Input({ required: true }) showPassword!: boolean
  @Output() setInputType = new EventEmitter<boolean>()

  change() {
    this.setInputType.emit(!this.showPassword)
  }
}
