import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdminDashboardCreateMusicGroupBody, AdminDashboardMusicGroupResponse, AdminDashboardUpdateMusicGroupBody, DEFAULT_MUSIC_GROUP, MUSIC_GROUP_STATUS, MusicGroupStatus } from '../../../types/musicGroupts';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from '../../../utils/dialog';
import { ShowError } from "../../auth-form/show-error";
import { LoadingGif } from "../../loading-gif/loading-gif";
import { formatMusicGroupStatus } from '../../../utils/format';

const ERRORS_DEFAULT = {
  general: '',
  title: '',
  image: '',
  description: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-music-group-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  styleUrls: ['../common-dialog.css'],
  templateUrl: './admin-music-group-dialog.html',
})
export class AdminMusicGroupDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private adminsService = inject(AdminsService)

  @Input({ required: true }) group!: AdminDashboardMusicGroupResponse
  @Output() onUpdatedGroup = new EventEmitter<{ slug: string, newGroup: AdminDashboardMusicGroupResponse }>()
  @Output() onCreatedGroup = new EventEmitter<AdminDashboardMusicGroupResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  MUSIC_GROUP_STATUS = MUSIC_GROUP_STATUS
  form = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    image: new FormControl('',[Validators.required, Validators.pattern(/^https:\/\/.+/), Validators.maxLength(environment.AVATAR_IMAGE_MAX_LENGTH)]),
    description: new FormControl('', [Validators.maxLength(environment.DESCRIPTION_MAX_LENGTH)]),
    status: new FormControl('', { validators: [Validators.required] }),
    isActive: new FormControl(true, { validators: [Validators.required] })
  })

  ngOnInit(): void {
    this.form.patchValue(this.group)

    this.form.setValidators((group) => {
      if (!this.group?.slug) return null

      const changed = this.getChangedProps(group)
      return Object.keys(changed).length === 0 ? { sameCredentials: true } : null
    })

    this.form.valueChanges.subscribe(() => this.handleClientErrors())
  }

  ngAfterViewInit(): void {
    this.getOpenDialog.emit((e) => this.updateInfoDialog.openDialog(e))
  }

  getChangedProps(form: any) {
    const title = form.get('title')?.value
    const image = form.get('image')?.value
    const description = form.get('description')?.value
    const status = form.get('status')?.value
    const isActive = form.get('isActive')?.value

    const changed: AdminDashboardUpdateMusicGroupBody = {}
    if (title && title !== this.group?.title) changed.title = title
    if (image && image !== this.group?.image) changed.image = image
    if (description && description !== this.group?.description) changed.description = description
    if (status && status !== this.group?.status) changed.status = status
    if ((isActive === false || isActive === true) && isActive !== this.group?.isActive) changed.isActive = isActive

    return changed
  }

  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  submitForm() {
    if (!this.form.valid) return
    this.fetching = true

    if (!this.group?.slug) {
      const body = { ...this.form.value }
      this.adminsService.createMusicGroup(body as AdminDashboardCreateMusicGroupBody).subscribe({
        error: (e) => this.handleHttpErrors(e),
        next: (newGroup) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedGroup.emit(newGroup)
          this.form.patchValue(DEFAULT_MUSIC_GROUP)
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.adminsService.updateMusicGroup(this.group.slug, props).subscribe({
      error: (e) => this.handleHttpErrors(e),
      next: (newGroup) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedGroup.emit({ slug: this.group.slug, newGroup })
        this.form.patchValue({ ...newGroup })
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)
    const title = this.form.get('title')
    const image = this.form.get('image')
    const description = this.form.get('description')

    if (title?.hasError('maxlength')) this.errors.title = `Title must be at most 100 characters.`
    if (image?.hasError('pattern')) this.errors.image = 'Image URL must start with https://'
    else if (image?.hasError('maxlength')) this.errors.image = `Image URL must be at most ${environment.AVATAR_IMAGE_MAX_LENGTH} characters.`
    if (description?.hasError('maxlength')) this.errors.description = `Description must be at most 1000 characters.`
  }

  handleHttpErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error
    this.errors.general = `An unexpected error occurred. Please try again (${err?.error || e.status})`
    this.errors.canSubmit = true
  }

  isInvalid(err: any) {
    return err ? 'true' : ''
  }
  formatMusicGroupStatus(s: MusicGroupStatus) {
    return formatMusicGroupStatus(s)
  }
}
