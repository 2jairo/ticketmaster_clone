import { Component, inject, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequestBody, SigninRequestBody } from '../../types/userAuth';
import { tap } from 'rxjs';
import { ShowPassword } from "./show-password";
import { ShowError } from "./show-error";
import { AuthFormErrors, AuthFormOperations, EMAIL_MAX_LENGTH, PASSWORD_MAX_LENGTH, USERNAME_MAX_LENGTH } from '../../types/authFormErrors';

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, ShowPassword, RouterLink, ShowError],
  templateUrl: './auth-form.html'
})
export class AuthForm implements OnInit {
  private userAuthService = inject(UserAuthService)
  private route = inject(ActivatedRoute)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  operation: AuthFormOperations = 'login'
  fetching = false

  forms = {
    login: this.fb.group({
      credential: new FormControl('', [Validators.required, Validators.maxLength(EMAIL_MAX_LENGTH)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(PASSWORD_MAX_LENGTH)]),
    }),
    signin: this.fb.group(
      {
        username: new FormControl('', [Validators.required, Validators.maxLength(USERNAME_MAX_LENGTH)]),
        email: new FormControl('', {
          validators: [Validators.required, Validators.email, Validators.maxLength(EMAIL_MAX_LENGTH)],
          updateOn: 'blur'
        }),
        password: new FormControl('', {
          validators: [Validators.required, Validators.maxLength(PASSWORD_MAX_LENGTH)],
          updateOn: 'blur'
        }),
        passwordRepeat: new FormControl('', {
          validators: [Validators.required, Validators.maxLength(PASSWORD_MAX_LENGTH)],
          updateOn: 'blur'
        })
      },
      {
        validators: (group) => {
          const password = group.get('password')?.value;
          const passwordRepeat = group.get('passwordRepeat')?.value;
          return password === passwordRepeat ? null : { passwordMismatch: true };
        }
      }
    ),
    'forgot-password': this.fb.group({
      credential: new FormControl('', [Validators.required, Validators.maxLength(EMAIL_MAX_LENGTH)])
    })
  }
  showPassword = {
    login: false,
    signin: false,
  }
  errors = new AuthFormErrors(this.forms)

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.operation = segments[segments.length - 1].path as AuthFormOperations
    })
  }

  submitForm() {
    if(!this.forms[this.operation].valid) {
      return
    }

    this.fetching = true

    if(this.operation === 'login') {
      this.userAuthService.login(this.forms.login.value as LoginRequestBody)
        .pipe(tap(() => this.fetching = false))
        .subscribe({
          error: (e) => this.errors.handleHttpErrorsLogin(e),
          next: () => this.router.navigate(['/']),
        })
    }
    else if(this.operation === 'signin') {
      const { passwordRepeat, ...signinBody } = this.forms.signin.value;

      this.userAuthService.signin(signinBody as SigninRequestBody)
        .pipe(tap(() => this.fetching = false))
        .subscribe({
          error: (e) => this.errors.handleHttpErrorsSignin(e),
          next: () => this.router.navigate(['/']),
        })
    }
    else if(this.operation === 'forgot-password') {
      //TODO
      // this.userAuthService.login(this.forms.login.value as LoginRequestBody)
      // .pipe(tap(() => this.fetching = false))
      // .subscribe({
      //   error: (e) => this.errors.handleHttpErrorsForgotPassword(e)
      // })
    }
  }


  setInputType(on: 'login' | 'signin', value: boolean) {
    this.showPassword[on] = value
  }
  isInvalid(err: any) {
    return err ? 'true' : ''
  }
}
