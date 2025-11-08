import { Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdminDashboardUpdateUserBody, AdminDashboardUserResponse } from '../../../types/adminDashboard';
import { UserAvatar } from "../../user-avatar/user-avatar";
import { formatUserRole } from '../../../utils/format';
import { USER_ROLES, UserRole } from '../../../types/userAuth';
import { Dialog } from "../../../utils/dialog";
import { LoadingGif } from "../../loading-gif/loading-gif";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { ShowError } from '../../auth-form/show-error';
import { ShowPassword } from '../../auth-form/show-password';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrKind, LocalErrorResponse } from '../../../types/error';

const ERRORS_DEFAULT = {
  general: '',
  username: '',
  email: '',
  image: '',
  password: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-user-card',
  imports: [ReactiveFormsModule, ShowError, ShowPassword, UserAvatar, Dialog, LoadingGif],
  templateUrl: './admin-user-card.html',
})
export class AdminUserCard implements OnInit {
  private fb = inject(FormBuilder)
  private adminsService = inject(AdminsService)

  @Input({ required: true }) user!: AdminDashboardUserResponse
  @Output() onUpdatedUser = new EventEmitter<{ username: string, newUser: AdminDashboardUserResponse }>()
  @Output() onDeletedUser = new EventEmitter<{ username: string }>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog
  @ViewChild('settings') settingsDialog!: ElementRef<HTMLDetailsElement>

  USER_ROLES = USER_ROLES
  form = this.fb.group({
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
    ),
    password: new FormControl('', {
      validators: [Validators.maxLength(environment.PASSWORD_MAX_LENGTH)],
    }),
    isActive: new FormControl(true, {
      validators: [Validators.required]
    }),
    role: new FormControl('', {
      validators: [Validators.required]
    })
  },
    {
      validators: (group) => {
        const changed = this.getChangedProps(group)

        return Object.keys(changed).length === 0
          ? { sameCredentials: true }
          : null
      }
    }
  )

  showPassword = false
  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  ngOnInit(): void {
    this.form.patchValue(this.user)

    this.form.valueChanges.subscribe(() => {
      this.handleClientErrors()
    })
  }

  getChangedProps(form: AbstractControl | FormGroup) {
    const username = form.get('username')?.value
    const email = form.get('email')?.value
    const img = form.get('image')?.value
    const isActive = form.get('isActive')?.value
    const role = form.get('role')?.value
    const password = form.get('password')?.value

    const changed: Partial<AdminDashboardUpdateUserBody> = {}

    if (username && username !== this.user?.username) changed.username = username
    if (email && email !== this.user?.email) changed.email = email
    if (img && img !== this.user?.image) changed.image = img
    if (isActive === false || isActive === true && isActive !== this.user?.isActive) changed.isActive = isActive
    if (role && role !== this.user?.role) changed.role = role as UserRole
    if (password) changed.password = password

    return changed
  }

  submitForm() {
    if (!this.form.valid) {
      return
    }
    this.fetching = true

    const props = this.getChangedProps(this.form)
    this.adminsService.updateUser(this.user.username, props).subscribe({
      error: (e) => this.handleHttpErrors(e),
      next: (newUser) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedUser.emit({ username: this.user.username, newUser })

        const { followers, followingGroups, followingGroupsLength, followingUsers, followingUsersLength, ...rest } = newUser
        this.form.setValue({ ...rest, password: '' })
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)

    const usernameCtrl = this.form.get('username')
    const emailCtrl = this.form.get('email')
    const imgCtrl = this.form.get('image')

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

  handleHttpErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error as LocalErrorResponse
    if (err.error === ErrKind.UniqueConstraintViolation && (err.message === 'username' || err.message === 'email')) {
      this.errors[err.message] = 'Alredy taken'
      this.errors.general = 'Some fields are alredy taken'
    }
    else {
      this.errors.general = `An unexpected error occurred. Please try again (${err.error})`
      this.errors.canSubmit = true
    }
  }

  settingsDeleteUser() {
    this.adminsService.deleteUser(this.user.username).subscribe(() => {
      this.settingsDialog.nativeElement.open = false
      this.onDeletedUser.emit({ username: this.user.username })
    })
  }

  isInvalid(err: any) {
    return err ? 'true' : ''
  }
  setInputType(value: boolean) {
    this.showPassword = value
  }
  formatUserRole(r: UserRole) {
    return formatUserRole(r)
  }
}
