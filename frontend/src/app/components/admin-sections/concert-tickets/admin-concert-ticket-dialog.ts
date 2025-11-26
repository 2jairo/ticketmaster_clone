import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Dialog } from '../../../utils/dialog';
import { LoadingGif } from '../../loading-gif/loading-gif';
import { ShowError } from '../../auth-form/show-error';
import { AdminDashboardConcertTicketResponse, AdminDashboardUpdateConcertTicket, AdminDashboardCreateConcertTicket } from '../../../types/concertTickets';
import { AdminsService } from '../../../services/admins.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AdminDashboardConcertResponse } from '../../../types/adminDashboard';

const ERRORS_DEFAULT = {
  general: '',
  location: '',
  canSubmit: true,
}

@Component({
  selector: 'app-admin-concert-ticket-dialog',
  imports: [ShowError, LoadingGif, ReactiveFormsModule, Dialog],
  styleUrls: ['../common-dialog.css'],
  templateUrl: './admin-concert-ticket-dialog.html',
})
export class AdminConcertTicketDialog implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder)
  private adminsService = inject(AdminsService)

  @Input({ required: true }) group!: AdminDashboardConcertTicketResponse
  @Output() onUpdatedTicket = new EventEmitter<{ id: string, newTicket: AdminDashboardConcertTicketResponse }>()
  @Output() onCreatedTicket = new EventEmitter<AdminDashboardConcertTicketResponse>()
  @Output() getOpenDialog = new EventEmitter<(e: PointerEvent) => void>()
  @ViewChild(Dialog) updateInfoDialog!: Dialog

  form = this.fb.group({
    location: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    concertSlug: new FormControl('', [Validators.required]),
    available: new FormControl(0, [Validators.min(0), Validators.required]),
    price: new FormControl(0, [Validators.min(0), Validators.required])
  })

  concerts: AdminDashboardConcertResponse[] = []
  concertsLoaded = false

  ngOnInit(): void {
    this.formPatchValue(this.group)
    this.form.setValidators((group) => {
      if (!this.group?.id) return null

      const changed = this.getChangedProps(group)
      return Object.keys(changed).length === 0 ? { sameCredentials: true } : null
    })

    this.form.valueChanges.subscribe(() => this.handleClientErrors())
  }

  ngAfterViewInit(): void {
    this.getOpenDialog.emit((e) => this.updateInfoDialog.openDialog(e))
  }

  formPatchValue(group: AdminDashboardConcertTicketResponse) {
    const { price, ...rest } = group
    this.form.patchValue({ ...rest, price: price / 100 })
  }

  getChangedProps(form: any) {
    const location = form.get('location')?.value
    const concertSlug = form.get('concertSlug')?.value
    const available = form.get('available')?.value
    const price = form.get('price')?.value

    const changed: AdminDashboardUpdateConcertTicket = {}
    if (location && location !== this.group?.location) changed.location = location
    if (concertSlug && concertSlug !== this.group?.concertSlug) changed.concertSlug = concertSlug
    if (available !== undefined && available !== this.group?.available) changed.available = available
    if (price !== undefined && price * 100 !== this.group?.price) changed.price = Math.round(price * 100)

    return changed
  }

  fetching = false
  errors = structuredClone(ERRORS_DEFAULT)

  submitForm() {
    if (!this.form.valid) return
    this.fetching = true

    if (!this.group?.id) {
      const props = this.form.value
      props.price = props.price !== undefined ? Math.round((this.form.value.price || 0) * 100) : 0

      this.adminsService.createConcertTicket(props as AdminDashboardCreateConcertTicket).subscribe({
        error: (e: HttpErrorResponse) => this.handleHttpErrors(e),
        next: (newTicket: AdminDashboardConcertTicketResponse) => {
          this.updateInfoDialog.closeDialog()
          this.onCreatedTicket.emit(newTicket)
          this.form.reset()
        },
        complete: () => this.fetching = false
      })
      return
    }

    const props = this.getChangedProps(this.form)
    this.adminsService.updateConcertTicket(this.group.id, props).subscribe({
      error: (e: HttpErrorResponse) => this.handleHttpErrors(e),
      next: (newTicket: AdminDashboardConcertTicketResponse) => {
        this.updateInfoDialog.closeDialog()
        this.onUpdatedTicket.emit({ id: this.group.id, newTicket })
        this.formPatchValue(newTicket)
      },
      complete: () => this.fetching = false
    })
  }

  handleClientErrors() {
    this.errors = structuredClone(ERRORS_DEFAULT)
    const location = this.form.get('location')

    if (location?.hasError('maxlength')) this.errors.location = `Location must be at most 100 characters.`
  }

  handleHttpErrors(e: HttpErrorResponse) {
    this.errors = structuredClone(ERRORS_DEFAULT)
    this.errors.canSubmit = false
    this.fetching = false

    const err = e.error
    this.errors.general = `An unexpected error occurred. Please try again (${err?.error || e.status})`
    this.errors.canSubmit = true
  }

  loadConcerts() {
    if (this.concertsLoaded) return

    this.concertsLoaded = true
    this.adminsService.getConcertList({ offset: 0, size: 1000 }).subscribe({
      next: (concerts) => {
        this.concerts = concerts
      },
      error: () => {
        this.concertsLoaded = false
      }
    })
  }

  isInvalid(err: any) {
    return err ? 'true' : ''
  }
}
