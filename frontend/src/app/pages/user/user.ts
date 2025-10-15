import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserSectionsSideMenu } from '../../components/user-sections-side-menu/user-sections-side-menu';

@Component({
  selector: 'app-user',
  imports: [UserSectionsSideMenu, RouterOutlet],
  templateUrl: './user.html'
})
export class User {

}
