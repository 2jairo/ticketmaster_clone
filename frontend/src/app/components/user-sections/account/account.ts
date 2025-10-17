import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { AccountInfoForm } from "./account-info-form";
import { PasswordsForm } from "./passwords-form";
import { UserAuthService } from '../../../services/userAuth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [AccountInfoForm, PasswordsForm],
  templateUrl: './account.html'
})
export class Account {
  private renderer2 = inject(Renderer2)
  private userAuthService = inject(UserAuthService)
  private router = inject(Router)

  private removeDocumentClickListener!: () => void


  @ViewChild('logout') logoutDialog!: ElementRef<HTMLDialogElement>
  @ViewChild('logoutContent') logoutDialogContent!: ElementRef<HTMLElement>

  closeLogoutDialog() {
    if(this.removeDocumentClickListener) {
      this.removeDocumentClickListener()
    }
    this.logoutDialog.nativeElement.close()
  }

  openLogoutDialog(e: PointerEvent) {
    e.stopPropagation()

    this.logoutDialog.nativeElement.showModal()

    this.removeDocumentClickListener = this.renderer2.listen(document, 'click', (e) => {

      if(!this.logoutDialogContent.nativeElement.contains(e.target)) {
        this.closeLogoutDialog()
      }
    })
  }

  handleLogout() {
    this.userAuthService.logout()
    this.closeLogoutDialog()
    this.router.navigate(['/'])
  }
}
