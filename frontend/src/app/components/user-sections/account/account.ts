import { Component } from '@angular/core';
import { AccountInfoForm } from "./account-info-form";
import { PasswordsForm } from "./passwords-form";

@Component({
  selector: 'app-account',
  imports: [AccountInfoForm, PasswordsForm],
  templateUrl: './account.html'
})
export class Account {

}
