import { Component } from '@angular/core';
import { ProfileSideMenu } from "../../components/profile-side-menu/profile-side-menu";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [ProfileSideMenu, RouterOutlet],
  templateUrl: './profile.html'
})
export class Profile {

}
