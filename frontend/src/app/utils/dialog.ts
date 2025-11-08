import { ContentChild, Directive, ElementRef, inject, Renderer2 } from "@angular/core"

@Directive({
  selector: '[appDialog]',
})
export class Dialog {
  private renderer2 = inject(Renderer2)

  @ContentChild('dialogContent') dialogContent!: ElementRef<HTMLElement>
  constructor(private dialog: ElementRef<HTMLDialogElement>) {}

  private removeDocumentClickListener!: () => void

  closeDialog() {
    if (this.removeDocumentClickListener) {
      this.removeDocumentClickListener()
    }
    this.dialog.nativeElement.close()
  }

  openDialog(e: PointerEvent) {
    e.stopPropagation()

    this.dialog.nativeElement.showModal()

    this.removeDocumentClickListener = this.renderer2.listen(document, 'click', (e) => {

      if (!this.dialogContent.nativeElement.contains(e.target)) {
        this.closeDialog()
      }
    })
  }
}
