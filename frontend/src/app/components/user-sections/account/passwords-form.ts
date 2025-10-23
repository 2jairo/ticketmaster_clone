import { Component, inject, OnInit } from '@angular/core';
import { ShowPassword } from "../../auth-form/show-password";
import { ShowError } from "../../auth-form/show-error";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserAuthService } from '../../../services/userAuth.service';
import { environment } from '../../../../environments/environment';
import { LoadingGif } from "../../loading-gif/loading-gif";
import { ChangePasswordRequestBody } from '../../../types/userAuth';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LocalErrorResponse } from '../../../types/error';

const ERRORS_DEFAULT = {
  oldPassword: '',
  newPasswords: '',
  canSubmit: true,
  general: {
    msg: '',
    icon: 'fa-solid fa-circle-exclamation'
  }
}

@Component({
  selector: 'app-passwords-form',
  imports: [ShowPassword, ShowError, ReactiveFormsModule, LoadingGif],
  templateUrl: './passwords-form.html'
})
export class PasswordsForm implements OnInit {
  private userAuthService = inject(UserAuthService)
  private fb = inject(FormBuilder)

  passwordsForm = this.fb.group(
    {
      oldPassword: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(environment.PASSWORD_MAX_LENGTH)],
      }),
      newPassword: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(environment.PASSWORD_MAX_LENGTH)],
      }),
      newPasswordRepeat: new FormControl('', {
        validators: [Validators.required, Validators.maxLength(environment.PASSWORD_MAX_LENGTH)],
      }),
    },
    {
      validators: (group) => {
        const newPassword = group.get('newPassword')?.value
        const newPasswordRepeat = group.get('newPasswordRepeat')?.value
        const oldPassword = group.get('oldPassword')?.value

        if(newPassword !== newPasswordRepeat) {
          return { passwordMismatch: true }
        }
        if(oldPassword === newPassword) {
          return { samePassword: true }
        }
        return null
      }
    }
  )

  errors = structuredClone(ERRORS_DEFAULT)

  showPassword = {
    old: false,
    new: false,
  }

  fetching = false

  setInputType(on: 'old' | 'new', value: boolean) {
    this.showPassword[on] = value
  }
  isInvalid(err: any) {
    return err ? 'true' : ''
  }

  ngOnInit(): void {
    this.passwordsForm.valueChanges.subscribe(() => {
      this.handleClientPasswordsErrors()
    })
  }

  handleClientPasswordsErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)

    const oldPasswordCtrl = this.passwordsForm.get('oldPassword');
    const newPasswordCtrl = this.passwordsForm.get('newPassword');
    const newPasswordRepeatCtrl = this.passwordsForm.get('newPasswordRepeat');

    if (this.passwordsForm.hasError('passwordMismatch') && (newPasswordCtrl?.value && newPasswordRepeatCtrl?.value)) {
      this.errors.newPasswords = 'New passwords do not match.';
    } else if(this.passwordsForm.hasError('samePassword') && (newPasswordCtrl?.value && newPasswordRepeatCtrl?.value)) {
      this.errors.general.msg = 'New password must be different from old password.';
    } else if (oldPasswordCtrl?.hasError('maxlength')) {
      this.errors.oldPassword = `Old password must be at most ${environment.PASSWORD_MAX_LENGTH} characters.`;
    } else if (newPasswordCtrl?.hasError('maxlength') || newPasswordRepeatCtrl?.hasError('maxlength')) {
      this.errors.newPasswords = `New passwords must be at most ${environment.PASSWORD_MAX_LENGTH} characters.`;
    }
  }

  handleHttpPasswordsErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error as LocalErrorResponse
    // if(err.error === ErrKind.UniqueConstraintViolation && (err.message === 'username' || err.message === 'email')) {
    //   this.errors[err.message] = 'Alredy taken'
    //   this.errors.general.msg = 'Some fields are alredy taken'
    // }

    this.errors.general.msg = `An unexpected error occurred. Please try again (${err.error})`
    this.errors.canSubmit = true
  }

  submitForm() {
    if (!this.passwordsForm.valid) {
      return
    }
    this.fetching = true

    const body: ChangePasswordRequestBody = {
      new: this.passwordsForm.value.newPassword || '',
      old: this.passwordsForm.value.oldPassword || ''
    }
    this.userAuthService.updatePassword(body)
      .pipe(tap(() => this.fetching = false))
      .subscribe({
        error: (e) => this.handleHttpPasswordsErrors(e),
        next: () => {
          this.passwordsForm.reset()
          this.errors.general = {
            icon: 'fa-solid fa-check',
            msg: 'Your account was updated successfully'
          }
        }
      })
  }

}
