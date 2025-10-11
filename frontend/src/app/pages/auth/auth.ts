import { Component } from '@angular/core';
import { AuthForm } from "../../components/auth-form/auth-form";

@Component({
  selector: 'app-auth',
  imports: [AuthForm],
  templateUrl: './auth.html'
})
export class Auth {

}
