import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MerchDashboardCreateMerchCategoryBody, MerchDashboardMerchCategoryResponse, MerchDashboardUpdateMerchCategoryBody, DEFAULT_MERCH_CATEGORY } from '../../../types/merchDashboard';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MerchandisingService } from '../../../services/merchandising.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from '../../../utils/dialog';
import { ShowError } from '../../auth-form/show-error';
import { LoadingGif } from '../../loading-gif/loading-gif';

const ERRORS_DEFAULT = {
  general: '',
  title: '',
  image: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-merch-category-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  styleUrls: ['../common-dialog.css'],
  templateUrl: './admin-merch-category-dialog.html',
})
export class AdminMerchCategoryDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private merchandisingService = inject(MerchandisingService)

  @Input({ required: true }) group!: MerchDashboardMerchCategoryResponse
  @Output() onUpdatedMerchCategory = new EventEmitter<{ slug: string, newMerchCategory: MerchDashboardMerchCategoryResponse }>()
  @Output() onCreatedMerchCategory = new EventEmitter<MerchDashboardMerchCategoryResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  form = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    image: new FormControl('', [Validators.required, Validators.pattern(/^https:\/\/.+/), Validators.maxLength(environment.AVATAR_IMAGE_MAX_LENGTH)])
  })

  ngOnInit(): void {
    this.formPatchValue(this.group)
    this.form.setValidators((group) => {
      if (!this.group?.slug) return null

      const changed = this.getChangedProps(group)
      return Object.keys(changed).length === 0 ? { sameCredentials: true } : null
    })

    this.form.valueChanges.subscribe(() => this.handleClientErrors())
  }

  formPatchValue(group: MerchDashboardMerchCategoryResponse) {
    this.form.patchValue(group)
  }

  ngAfterViewInit(): void {
    this.getOpenDialog.emit((e) => this.updateInfoDialog.openDialog(e))
  }

  getChangedProps(form: any) {
    const title = form.get('title')?.value
    const image = form.get('image')?.value

    const changed: MerchDashboardUpdateMerchCategoryBody = {}
    if (title && title !== this.group?.title) changed.title = title
    if (image && image !== this.group?.image) changed.image = image

    return changed
  }

  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  submitForm() {
    if (!this.form.valid) return
    this.fetching = true

    if (!this.group?.slug) {
      this.merchandisingService.createMerchCategory(this.form.value as MerchDashboardCreateMerchCategoryBody).subscribe({
        error: (e) => this.handleHttpErrors(e),
        next: (newMerchCategory) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedMerchCategory.emit(newMerchCategory)
          this.form.patchValue(DEFAULT_MERCH_CATEGORY)
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.merchandisingService.updateMerchCategory(this.group.slug, props).subscribe({
      error: (e) => this.handleHttpErrors(e),
      next: (newMerchCategory) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedMerchCategory.emit({ slug: this.group.slug, newMerchCategory })
        this.formPatchValue(newMerchCategory)
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)
    const title = this.form.get('title')
    const image = this.form.get('image')

    if (title?.hasError('maxlength')) this.errors.title = `Title must be at most ${environment.TITLE_MAX_LENGTH} characters.`
    if (image?.hasError('pattern')) this.errors.image = 'Image URL must start with https://'
    if (image?.hasError('maxlength')) this.errors.image = `Image URL must be at most ${environment.AVATAR_IMAGE_MAX_LENGTH} characters.`
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
}
