import { Component, inject, OnInit } from '@angular/core';
import { UserAuthService } from '../../services/userAuth.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequestBody, SigninRequestBody } from '../../types/userAuth';
import { tap } from 'rxjs';
import { ShowPassword } from "./show-password";

@Component({
  selector: 'app-auth-form',
  imports: [ReactiveFormsModule, ShowPassword, RouterLink],
  templateUrl: './auth-form.html'
})
export class AuthForm implements OnInit {
  private userAuthService = inject(UserAuthService)
  private route = inject(ActivatedRoute)
  private fb = inject(FormBuilder)
  private router = inject(Router)

  operation = 'login' as 'login' | 'signin' | 'forgot-password'
  fetching = false

  forms = {
    login: this.fb.group({
      credential: ['', [Validators.required, Validators.maxLength(50)]],
      password: ['', Validators.required],
    }),
    signin: this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        passwordRepeat: ['', Validators.required]
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
      credential: ['', Validators.required]
    })
  }
  showPassword = {
    login: false,
    signin: false,
  }

  ngOnInit(): void {
    this.route.url.subscribe((segments) => {
      this.operation = segments[segments.length - 1].path as 'login' | 'signin' | 'forgot-password'
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
          error: (e) => this.handleError(e),
          next: () => this.router.navigate(['/']),
        })
    }
    else if(this.operation === 'signin') {
      this.userAuthService.signin(this.forms.signin.value as SigninRequestBody)
        .pipe(tap(() => this.fetching = false))
        .subscribe({
          error: (e) => this.handleError(e),
          next: () => this.router.navigate(['/']),
        })
    }
    else if(this.operation === 'forgot-password') {
      //TODO
      // this.userAuthService.login(this.forms.login.value as LoginRequestBody)
      // .pipe(tap(() => this.fetching = false))
      // .subscribe({
      //   error: (e) => this.handleError(e)
      // })
    }
  }

  handleError(e: string) {
    console.log('handle error')
    //TODO
  }

  setInputType(on: 'login' | 'signin', value: boolean) {
    this.showPassword[on] = value
  }
}
