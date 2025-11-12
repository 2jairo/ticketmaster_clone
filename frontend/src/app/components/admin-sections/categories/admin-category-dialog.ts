import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdminDashboardCreateCategoryBody, AdminDashboardCategoryResponse, AdminDashboardUpdateCategoryBody, DEFAULT_CATEGORY, CATEGORY_STATUS, CategoryStatus } from '../../../types/categories';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from '../../../utils/dialog';
import { ShowError } from '../../auth-form/show-error';
import { LoadingGif } from '../../loading-gif/loading-gif';
import { formatCategoryStatus } from '../../../utils/format';

const ERRORS_DEFAULT = {
  general: '',
  title: '',
  image: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-category-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  templateUrl: './admin-category-dialog.html',
})
export class AdminCategoryDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private adminsService = inject(AdminsService)

  @Input({ required: true }) group!: AdminDashboardCategoryResponse
  @Output() onUpdatedCategory = new EventEmitter<{ slug: string, newCategory: AdminDashboardCategoryResponse }>()
  @Output() onCreatedCategory = new EventEmitter<AdminDashboardCategoryResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  CATEGORY_STATUS = CATEGORY_STATUS
  form = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    images: this.fb.array([]),
    status: new FormControl('', { validators: [Validators.required] }),
    isActive: new FormControl(true, { validators: [Validators.required] })
  })

  ngOnInit(): void {
    this.formPatchValue(this.group)
    this.form.setValidators((group) => {
      if (!this.group?.slug) return null

      const changed = this.getChangedProps(group)
      return Object.keys(changed).length === 0 ? { sameCredentials: true } : null
    })
    this.images.valueChanges.subscribe(() => {
      this.form.updateValueAndValidity({ onlySelf: true })
    })

    this.form.valueChanges.subscribe(() => this.handleClientErrors())
  }

  formPatchValue(group: AdminDashboardCategoryResponse) {
    const { images, ...groupRest } = group
    this.form.patchValue(groupRest)

    this.images.clear()
    for (const img of images) {
      this.addImage({ img })
    }
  }

  ngAfterViewInit(): void {
    this.getOpenDialog.emit((e) => this.updateInfoDialog.openDialog(e))
  }

  get images() {
    return this.form.get('images') as FormArray
  }

  createImage(value?: string) {
    return new FormControl(
      value ? value : DEFAULT_CATEGORY.images[0],
      [Validators.required, Validators.pattern(/^https:\/\/.+/), Validators.maxLength(environment.AVATAR_IMAGE_MAX_LENGTH)]
    )
  }

  addImage({ img, event }: { img?: string, event?: PointerEvent }) {
    if (event) {
      event.preventDefault()
    }

    this.images.push(this.createImage(img))
  }

  removeImage(idx: number) {
    this.images.removeAt(idx)
  }

  arraysHaveSameUniqueValues(arr1: string[], arr2: string[]) {
    if (arr1.length !== arr2.length) {
      return false
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }

  getChangedProps(form: any) {
    const title = form.get('title')?.value
    const status = form.get('status')?.value
    const isActive = form.get('isActive')?.value
    const images = (form.get('images') as FormArray).value
    const sameImages = this.arraysHaveSameUniqueValues(images, this.group ? this.group.images : [])

    const changed: AdminDashboardUpdateCategoryBody = {}
    if (title && title !== this.group?.title) changed.title = title
    if (status && status !== this.group?.status) changed.status = status
    if ((isActive === false || isActive === true) && isActive !== this.group?.isActive) changed.isActive = isActive
    if (!sameImages) changed.images = images

    return changed
  }

  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  submitForm() {
    if (!this.form.valid) return
    this.fetching = true

    if (!this.group?.slug) {
      const props = this.getChangedProps(this.form)

      this.adminsService.createCategory(props as AdminDashboardCreateCategoryBody).subscribe({
        error: (e) => this.handleHttpErrors(e),
        next: (newCategory) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedCategory.emit(newCategory)
          this.form.patchValue(DEFAULT_CATEGORY)
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.adminsService.updateCategory(this.group.slug, props).subscribe({
      error: (e) => this.handleHttpErrors(e),
      next: (newCategory) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedCategory.emit({ slug: this.group.slug, newCategory })
        this.formPatchValue(newCategory)
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
    else if (image?.hasError('maxlength')) this.errors.image = `Image URL must be at most ${environment.AVATAR_IMAGE_MAX_LENGTH} characters.`
  }

  handleHttpErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error
    this.errors.general = `An unexpected error occurred. Please try again (${err?.error || e.status})`
    this.errors.canSubmit = true
  }


  formatCategoryStatus(s: CategoryStatus) {
    return formatCategoryStatus(s)
  }
  isInvalid(err: any) {
    return err ? 'true' : ''
  }
}
