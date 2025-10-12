import { HttpErrorResponse } from "@angular/common/http";
import { ErrKind, LocalErrorResponse } from "./error";
import { FormGroup } from "@angular/forms";

export type AuthFormOperations = 'login' | 'signin' | 'forgot-password'
export const USERNAME_MAX_LENGTH = 40
export const EMAIL_MAX_LENGTH = 80
export const PASSWORD_MAX_LENGTH = 80

const ERRORS = {
  login: {
    general: '',
    credential: '',
    password: '',
  },
  signin: {
    general: '',
    username: '',
    email: '',
    passwords: '',
  },
  'forgot-password': {
    general: '',
    credential: '',
  },
  canSubmit: true
}

export class AuthFormErrors {
  login = { ...ERRORS.login }
  signin = { ...ERRORS.signin }
  'forgot-password' = { ...ERRORS['forgot-password'] }
  canSubmit = ERRORS.canSubmit

  constructor(
    private forms: { login: FormGroup, signin: FormGroup, ['forgot-password']: FormGroup },
  ) {
    this.forms.login.valueChanges.subscribe(() => this.handleClientErrorsLogin())
    this.forms.signin.valueChanges.subscribe(() => this.handleClientErrorsSignin())
    this.forms["forgot-password"].valueChanges.subscribe(() => this.hanldeClientErrorsForgotPassword())
  }

  private resetErrors() {
    this.login = { ...ERRORS.login }
    this.signin = { ...ERRORS.signin }
    this['forgot-password'] = { ...ERRORS['forgot-password'] }
    this.canSubmit = ERRORS.canSubmit
  }

  handleClientErrorsLogin() {
    this.resetErrors()

    const form = this.forms.login
    const credentialCtrl = form.get('credential')
    const passwordCtrl = form.get('password')

    if (credentialCtrl?.hasError('maxlength')) {
      this.login.credential = `The email or username length can't be more than ${EMAIL_MAX_LENGTH}`;
    }

    if (passwordCtrl?.hasError('maxlength')) {
      this.login.password = `The password length can't be more than ${PASSWORD_MAX_LENGTH}`;
    }
  }
  handleClientErrorsSignin() {
    this.resetErrors()

    const form = this.forms.signin
    const usernameCtrl = form.get('username')
    const emailCtrl = form.get('email')
    const passwordCtrl = form.get('password')
    const passwordRepeatCtrl = form.get('passwordRepeat')

    if (usernameCtrl?.hasError('maxlength')) {
      this.signin.username = `The username length can't be more than ${USERNAME_MAX_LENGTH}`
    }

    if (emailCtrl?.hasError('email')) {
      this.signin.email = 'Invalid email'
    } else if(emailCtrl?.hasError('maxlength')) {
      this.signin.email = `The email length can't be more than ${EMAIL_MAX_LENGTH}`
    }

    if (form.hasError('passwordMismatch') && passwordCtrl?.value && passwordRepeatCtrl?.value) {
      this.signin.passwords = 'Passwords do not match'
    } else if (passwordCtrl?.hasError('maxlength') || passwordRepeatCtrl?.hasError('maxLength')) {
      this.signin.passwords = `The password length can't be more than ${PASSWORD_MAX_LENGTH}`
    }
  }
  hanldeClientErrorsForgotPassword() {
    this.resetErrors()
  }

  handleHttpErrorsLogin(e: HttpErrorResponse) {
    this.resetErrors()
    this.canSubmit = false

    const err = e.error as LocalErrorResponse
    if (err.error === ErrKind.UserNotFound) {
      this.login.general = `Invalid credentials. The user doesn't exist or the password doesn't match`
    }
    else {
      this.login.general = 'An unexpected error occurred. Please try again.'
    }
  }

  handleHttpErrorsSignin(e: HttpErrorResponse) {
    this.resetErrors()
    this.canSubmit = false

    const err = e.error as LocalErrorResponse
    if (err.error === ErrKind.UniqueConstraintViolation && (err.message === 'username' || err.message === 'email')) {
      this.signin[err.message] = 'Already taken'
      this.signin.general = 'Some fields are already taken'
    }
    else if (err.error === ErrKind.RequiredConstraintViolation && err.message && err.message in this.signin) {
      // @ts-ignore
      this.signin[err.message] = 'This field is required'
      this.signin.general = 'Some fields are required'
    }
    else if (err.error === ErrKind.RegexConstraintViolation && err.message && err.message in this.signin) {
      // @ts-ignore
      this.signin[err.message] = err.message === 'email'
        ? 'Invalid format. (user@example.com)'
        : 'Invalid format'
      this.signin.general = 'Some fields have invalid format'
    }
    else {
      this.signin.general = 'An unexpected error occurred. Please try again.'
    }
  }

  handleHttpErrorsForgotPassword(e: HttpErrorResponse) {
    this.resetErrors()
    this.canSubmit = false
  }
}
