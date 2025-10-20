import { Component, inject, OnInit } from '@angular/core';
import { ShowError } from "../../auth-form/show-error";
import { UserAuthService } from '../../../services/userAuth.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ChangeCredentialsRequestBody, LoginSigninResponse } from '../../../types/userAuth';
import { tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingGif } from "../../loading-gif/loading-gif";
import { ErrKind, LocalErrorResponse } from '../../../types/error';

const ERRORS_DEFAULT = {
  username: '',
  email: '',
  image: '',
  canSubmit: true,
  general: {
    msg: '',
    icon: 'fa-solid fa-circle-exclamation'
  }
}

@Component({
  selector: 'app-account-info-form',
  imports: [ShowError, ReactiveFormsModule, LoadingGif],
  templateUrl: './account-info-form.html'
})
export class AccountInfoForm implements OnInit {
  private userAuthService = inject(UserAuthService)
  private fb = inject(FormBuilder)

  userValues: LoginSigninResponse | null = null

  credentialsForm = this.fb.group(
    {
      username: new FormControl('', [Validators.required, Validators.maxLength(environment.USERNAME_MAX_LENGTH)]),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email, Validators.maxLength(environment.EMAIL_MAX_LENGTH)],
        updateOn: 'blur'
      }),
      image: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern(/^https:\/\/.+/),
          Validators.maxLength(environment.AVATAR_IMAGE_MAX_LENGTH)
        ]
      )
    },
    {
      validators: (group) => {
        const username = group.get('username')?.value
        const email = group.get('email')?.value
        const img = group.get('image')?.value

        if (this.userValues?.username === username && this.userValues?.email === email && this.userValues?.image === img) {
          return { sameCredentials: true }
        }
        return null
      }
    }
  )

  errors = structuredClone(ERRORS_DEFAULT)

  fetching = false

  isInvalid(err: any) {
    return err ? 'true' : ''
  }

  ngOnInit(): void {
    this.userAuthService.user.subscribe((user) => {
      if(!user) {
        return
      }

      this.userValues = user
      this.credentialsForm.patchValue(user)
    })

    this.credentialsForm.valueChanges.subscribe(() => {
      this.handleClientCredentialsErrors()
    })
  }

  handleClientCredentialsErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)

    const usernameCtrl = this.credentialsForm.get('username')
    const emailCtrl = this.credentialsForm.get('email')
    const imgCtrl = this.credentialsForm.get('image')

    if (usernameCtrl?.hasError('maxlength')) {
      this.errors.username = `Username must be at most ${environment.USERNAME_MAX_LENGTH} characters.`
    }

    if (emailCtrl?.hasError('email')) {
      this.errors.email = 'Email must be valid.'
    } else if (emailCtrl?.hasError('maxlength')) {
      this.errors.email = `The email length can't be more than ${environment.EMAIL_MAX_LENGTH}`
    }

    if (imgCtrl?.hasError('pattern')) {
      this.errors.image = 'Image URL must start with https://'
    } else if (imgCtrl?.hasError('maxlength')) {
      this.errors.image = `Image URL must be at most ${environment.AVATAR_IMAGE_MAX_LENGTH} characters.`
    }
  }

  handleHttpCredentialsErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error as LocalErrorResponse
    if(err.error === ErrKind.UniqueConstraintViolation && (err.message === 'username' || err.message === 'email')) {
      this.errors[err.message] = 'Alredy taken'
      this.errors.general.msg = 'Some fields are alredy taken'
    }
    else {
      this.errors.general.msg = `An unexpected error occurred. Please try again (${err.error})`
      this.errors.canSubmit = true
    }
  }

  submitForm() {
    if(!this.credentialsForm.valid) {
      return
    }
    this.fetching = true

    this.userAuthService.updateCredentials(this.credentialsForm.value as ChangeCredentialsRequestBody)
      .pipe(tap(() => {
        console.log('this.fetching = false')
        this.fetching = false
      }))
      .subscribe({
        error: (e) => this.handleHttpCredentialsErrors(e),
        next: () => {
          this.errors.general = {
            icon: 'fa-solid fa-check',
            msg: 'Your account was updated successfully'
          }
        }
      })
  }
}
