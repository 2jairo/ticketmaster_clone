import { Component, inject, ViewChild } from '@angular/core';
import { AccountInfoForm } from "./account-info-form";
import { PasswordsForm } from "./passwords-form";
import { UserAuthService } from '../../../services/userAuth.service';
import { Router } from '@angular/router';
import { Dialog } from '../../../utils/dialog';

@Component({
  selector: 'app-account',
  imports: [AccountInfoForm, PasswordsForm, Dialog],
  templateUrl: './account.html'
})
export class Account {
  private userAuthService = inject(UserAuthService)
  private router = inject(Router)

  @ViewChild(Dialog) logoutDialog!: Dialog

  handleLogout() {
    this.userAuthService.logout()
    this.logoutDialog.closeDialog()
    this.router.navigate(['/'])
  }
}
