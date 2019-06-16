import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-transpose-modal',
  templateUrl: './transpose-modal.component.html',
  styleUrls: ['./transpose-modal.component.scss']
})

export class TransposeModalComponent implements OnInit {

  @ViewChild('okButton') okButton
  @Input() key: string
  @Output() cancel = new EventEmitter<boolean>()
  @Output() ok = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {
    this.okButton.nativeElement.focus()
  }

  onCancel() {
    this.cancel.emit(true)
  }

  onOk() {
    this.ok.emit('Z')
  }
}
