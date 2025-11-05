import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { AdminSectionsSideMenu } from "../../components/admin-sections-side-menu/admin-sections-side-menu";

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, AdminSectionsSideMenu],
  templateUrl: './admin.html',
})
export class Admin {

}
