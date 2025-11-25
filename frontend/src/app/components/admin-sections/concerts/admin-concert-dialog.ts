import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AdminDashboardConcertResponse, AdminDashboardCreateConcertResponse, AdminDashboardUpdateConcertResponse, CONCERT_STATUS, ConcertStatus, DEFAULT_CONCERT } from '../../../types/adminDashboard';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminsService } from '../../../services/admins.service';
import { CategoriesService } from '../../../services/categories.service';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Dialog } from '../../../utils/dialog';
import { ShowError } from "../../auth-form/show-error";
import { LoadingGif } from "../../loading-gif/loading-gif";
import { formatConcertStatus } from '../../../utils/format';

const ERRORS_DEFAULT = {
  general: '',
  title: '',
  description: '',
  locationName: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-concert-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  styleUrls: ['../common-dialog.css'],
  templateUrl: './admin-concert-dialog.html',
})
export class AdminConcertDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private adminsService = inject(AdminsService)

  @Input({ required: true }) concert!: AdminDashboardConcertResponse
  @Output() onUpdatedConcert = new EventEmitter<{ slug: string, newConcert: AdminDashboardConcertResponse }>()
  @Output() onCreatedConcert = new EventEmitter<AdminDashboardConcertResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  CONCERT_STATUS = CONCERT_STATUS
  form = this.fb.group({
    title: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    description: new FormControl('', [Validators.maxLength(environment.DESCRIPTION_MAX_LENGTH)]),
    locationName: new FormControl('', [Validators.required, Validators.maxLength(environment.TITLE_MAX_LENGTH)]),
    dateStart: new FormControl('', [Validators.required]),
    dateEnd: new FormControl('', [Validators.required]),
    status: new FormControl('', { validators: [Validators.required] }),
    isActive: new FormControl(true, { validators: [Validators.required] }),
    groupSlugs: new FormControl<string[]>([], { validators: [] }),
    categorySlugs: new FormControl<string[]>([], { validators: [] })
  })

  musicGroups: AdminDashboardConcertResponse['groups'] = []
  categories: AdminDashboardConcertResponse['categories'] = []
  musicGroupsLoaded = false
  categoriesLoaded = false

  ngOnInit(): void {
    // Initialize groups and categories from the concert
    this.musicGroups = this.concert.groups || []
    this.categories = this.concert.categories || []

    // Convert dates to input format
    const concert = {
      ...this.concert,
      dateStart: this.concert.dateStart ? new Date(this.concert.dateStart).toISOString().slice(0, 16) : '',
      dateEnd: this.concert.dateEnd ? new Date(this.concert.dateEnd).toISOString().slice(0, 16) : '',
      groupSlugs: this.concert.groups?.map(g => g.slug) || [],
      categorySlugs: this.concert.categories?.map(c => c.slug) || []
    }
    this.form.patchValue(concert)

    this.form.setValidators((group) => {
      if (!this.concert?.slug) return null

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
    const description = form.get('description')?.value
    const locationName = form.get('locationName')?.value
    const dateStart = form.get('dateStart')?.value
    const dateEnd = form.get('dateEnd')?.value
    const status = form.get('status')?.value
    const isActive = form.get('isActive')?.value
    const groupSlugs = form.get('groupSlugs')?.value || []
    const categorySlugs = form.get('categorySlugs')?.value || []

    const changed: AdminDashboardUpdateConcertResponse = {}
    if (title && title !== this.concert?.title) changed.title = title
    if (description && description !== this.concert?.description) changed.description = description
    if (locationName && locationName !== this.concert?.locationName) changed.locationName = locationName
    if (dateStart) {
      const newDate = new Date(dateStart)
      const oldDate = new Date(this.concert?.dateStart)
      if (newDate.getTime() !== oldDate.getTime()) changed.dateStart = newDate
    }
    if (dateEnd) {
      const newDate = new Date(dateEnd)
      const oldDate = new Date(this.concert?.dateEnd)
      if (newDate.getTime() !== oldDate.getTime()) changed.dateEnd = newDate
    }
    if (status && status !== this.concert?.status) changed.status = status
    if ((isActive === false || isActive === true) && isActive !== this.concert?.isActive) changed.isActive = isActive

    // Check if groups changed
    const oldGroupSlugs = this.concert?.groups?.map(g => g.slug).sort() || []
    const newGroupSlugs = [...groupSlugs].sort()
    if (JSON.stringify(oldGroupSlugs) !== JSON.stringify(newGroupSlugs)) {
      changed.groupSlugs = groupSlugs
    }

    // Check if categories changed
    const oldCategorySlugs = this.concert?.categories?.map(c => c.slug).sort() || []
    const newCategorySlugs = [...categorySlugs].sort()
    if (JSON.stringify(oldCategorySlugs) !== JSON.stringify(newCategorySlugs)) {
      changed.categorySlugs = categorySlugs
    }

    return changed
  }

  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  submitForm() {
    if (!this.form.valid) return
    this.fetching = true

    if (!this.concert?.slug) {
      const body = {
        ...this.form.value,
        dateStart: new Date(this.form.value.dateStart || ''),
        dateEnd: new Date(this.form.value.dateEnd || ''),
        location: {
          type: 'Point' as const,
          coordinates: [0, 0] as [number, number]
        }
      }
      this.adminsService.createConcert(body as AdminDashboardCreateConcertResponse).subscribe({
        error: (e) => this.handleHttpErrors(e),
        next: (newConcert) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedConcert.emit(newConcert)
          this.form.patchValue({
            ...DEFAULT_CONCERT,
            dateStart: '',
            dateEnd: ''
          })
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.adminsService.updateConcert(this.concert.slug, props).subscribe({
      error: (e) => this.handleHttpErrors(e),
      next: (newConcert) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedConcert.emit({ slug: this.concert.slug, newConcert })
        const formattedConcert = {
          ...newConcert,
          dateStart: new Date(newConcert.dateStart).toISOString().slice(0, 16),
          dateEnd: new Date(newConcert.dateEnd).toISOString().slice(0, 16)
        }
        this.form.patchValue(formattedConcert)
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)
    const title = this.form.get('title')
    const description = this.form.get('description')
    const locationName = this.form.get('locationName')

    if (title?.hasError('maxlength')) this.errors.title = `Title must be at most 100 characters.`
    if (description?.hasError('maxlength')) this.errors.description = `Description must be at most 1000 characters.`
    if (locationName?.hasError('maxlength')) this.errors.locationName = `Location name must be at most 100 characters.`
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

  formatConcertStatus(s: ConcertStatus) {
    return formatConcertStatus(s)
  }

  loadMusicGroups() {
    if (this.musicGroupsLoaded) return
    this.musicGroupsLoaded = true

    this.adminsService.getMusicGroupList({ offset: 0, size: 100 }).subscribe({
      next: (groups) => {
        // Keep existing groups and add new ones
        const existingSlugs = new Set(this.musicGroups.map(g => g.slug))
        const newGroups = groups.filter(g => !existingSlugs.has(g.slug))
        this.musicGroups = [...this.musicGroups, ...newGroups]
      },
      error: (e) => console.error('Failed to load music groups', e)
    })
  }

  loadCategories() {
    if (this.categoriesLoaded) return
    this.categoriesLoaded = true

    this.adminsService.getCategoryList({ offset: 0, size: 100 }).subscribe({
      next: (categories) => {
        // Keep existing categories and add new ones
        const existingSlugs = new Set(this.categories.map(c => c.slug))
        const newCategories = categories.filter(c => !existingSlugs.has(c.slug))
        this.categories = [...this.categories, ...newCategories]
      },
      error: (e) => console.error('Failed to load categories', e)
    })
  }

  toggleGroup(slug: string) {
    const current = this.form.get('groupSlugs')?.value || []
    const index = current.indexOf(slug)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(slug)
    }

    this.form.patchValue({ groupSlugs: [...current] })
  }

  isGroupSelected(slug: string): boolean {
    const current = this.form.get('groupSlugs')?.value || []
    return current.includes(slug)
  }

  toggleCategory(slug: string) {
    const current = this.form.get('categorySlugs')?.value || []
    const index = current.indexOf(slug)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(slug)
    }

    this.form.patchValue({ categorySlugs: [...current] })
  }

  isCategorySelected(slug: string): boolean {
    const current = this.form.get('categorySlugs')?.value || []
    return current.includes(slug)
  }
}
