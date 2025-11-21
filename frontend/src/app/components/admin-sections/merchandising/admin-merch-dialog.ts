import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '../../../utils/dialog';
import { LoadingGif } from '../../loading-gif/loading-gif';
import { ShowError } from '../../auth-form/show-error';
import { MerchDashboardMerchandisingResponse, MerchDashboardUpdateMerchandisingBody, MerchDashboardCreateMerchandisingBody } from '../../../types/merchDashboard';
import { MerchandisingService } from '../../../services/merchandising.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { arraysHaveSameUniqueValues } from '../../../utils/arrays';

const ERRORS_DEFAULT = {
  general: '',
  title: '',
  images: {
    idx: -1,
    value: ''
  },
  canSubmit: true,
}

@Component({
  selector: 'app-admin-merch-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  styleUrls: ['../common-dialog.css'],
  templateUrl: './admin-merch-dialog.html',
})
export class AdminMerchDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private merchService = inject(MerchandisingService)

  @Input({ required: true }) group!: MerchDashboardMerchandisingResponse
  @Output() onUpdatedMerch = new EventEmitter<{ slug: string, newMerch: MerchDashboardMerchandisingResponse }>()
  @Output() onCreatedMerch = new EventEmitter<MerchDashboardMerchandisingResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  form = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    images: this.fb.array([]),
    description: new FormControl('', []),
    categorySlug: new FormControl('', [Validators.required]),
    stock: new FormControl(0, [Validators.min(0), Validators.required]),
    price: new FormControl(0, [Validators.min(0), Validators.required])
  })

  categories: { title: string, slug: string, image: string }[] = []
  categoriesLoaded = false

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

  ngAfterViewInit(): void {
    this.getOpenDialog.emit((e) => this.updateInfoDialog.openDialog(e))
  }

  formPatchValue(group: MerchDashboardMerchandisingResponse) {
    const { images, price, category, ...rest } = group
    this.form.patchValue({ ...rest, categorySlug: category?.slug || '', price: price / 100 })

    this.images.clear()
    for (const img of images || []) {
      this.addImage({ img })
    }
  }

  get images() {
    return this.form.get('images') as FormArray
  }

  createImage(value?: string) {
    return new FormControl(
      value ? value : '',
      [Validators.required, Validators.pattern(/^https:\/\/.+/), Validators.maxLength(environment.AVATAR_IMAGE_MAX_LENGTH)]
    )
  }

  addImage({ img, event }: { img?: string, event?: PointerEvent }) {
    if (event) event.preventDefault()
    this.images.push(this.createImage(img))
  }

  removeImage(idx: number) {
    this.images.removeAt(idx)
  }

  getChangedProps(form: any) {
    const title = form.get('title')?.value
    const description = form.get('description')?.value
    const categorySlug = form.get('categorySlug')?.value
    const stock = form.get('stock')?.value
    const price = form.get('price')?.value
    const images = (form.get('images') as FormArray).value
    const sameImages = arraysHaveSameUniqueValues(images, this.group ? this.group.images : [])

    const changed: MerchDashboardUpdateMerchandisingBody = {}
    if (title && title !== this.group?.title) changed.title = title
    if (description && description !== this.group?.description) changed.description = description
    if (categorySlug && categorySlug !== this.group?.category?.slug) changed.categorySlug = categorySlug
    if (stock !== undefined && stock !== this.group?.stock) changed.stock = stock
    if (price !== undefined && price * 100 !== this.group?.price) changed.price = Math.round(price * 100)
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
      props.price = props.price !== undefined ? props.price : Math.round((this.form.value.price || 0) * 100)

      this.merchService.createMerchandise(props as MerchDashboardCreateMerchandisingBody).subscribe({
        error: (e: HttpErrorResponse) => this.handleHttpErrors(e),
        next: (newMerch: MerchDashboardMerchandisingResponse) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedMerch.emit(newMerch)
          this.form.reset()
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.merchService.updateMerchandise(this.group.slug, props).subscribe({
      error: (e: HttpErrorResponse) => this.handleHttpErrors(e),
      next: (newMerch: MerchDashboardMerchandisingResponse) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedMerch.emit({ slug: this.group.slug, newMerch })
        this.formPatchValue(newMerch)
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)
    const title = this.form.get('title')
    const images = this.images

    images.controls.some((c) => c.hasError(''))

    if (title?.hasError('maxlength')) this.errors.title = `Title must be at most ${environment.TITLE_MAX_LENGTH} characters.`

    for (let i = 0; i < this.images.controls.length; i++) {
      const c = this.images.controls[i];
      if(c.hasError('pattern')) {
        this.errors.images = {
          idx: i,
          value: 'Image URL must start with https://'
        }
        break
      }
      else if(c.hasError('maxlength')) {
        this.errors.images = {
          idx: i,
          value: `Image URL must be at most ${environment.AVATAR_IMAGE_MAX_LENGTH} characters.`,
        }
      }
      break
    }
  }

  handleHttpErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error
    this.errors.general = `An unexpected error occurred. Please try again (${err?.error || e.status})`
    this.errors.canSubmit = true
  }

  loadCategories() {
    if (this.categoriesLoaded) return

    this.categoriesLoaded = true
    this.merchService.getMerchCategories().subscribe({
      next: (categories) => {
        this.categories = categories
      },
      error: () => {
        this.categoriesLoaded = false
      }
    })
  }

  isInvalid(err: any) {
    return err ? 'true' : ''
  }
}
