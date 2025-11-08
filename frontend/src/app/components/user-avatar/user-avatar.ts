import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  imports: [],
  templateUrl: './user-avatar.html',
})
export class UserAvatar {
  @Input() width: string = "2em"
  @Input() height: string = "2em"
  @Input({ required: true }) avatar!: string
}
