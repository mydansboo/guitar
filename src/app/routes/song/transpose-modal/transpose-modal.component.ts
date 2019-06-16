import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-transpose-modal',
  templateUrl: './transpose-modal.component.html',
  styleUrls: ['./transpose-modal.component.scss']
})

export class TransposeModalComponent implements OnInit {

  @ViewChild('okButton') okButton
  @Input() key: string
  @Output() done = new EventEmitter<string>()

  origKey: string

  constructor() {}

  ngOnInit() {
    this.origKey = this.key
  }

  onOk() {
    this.done.emit(this.key)
  }

  onCancel() {
    this.done.emit(this.origKey)
  }

  onEasiest() {
    console.log('onEasiest')
  }

  setKey(key) {
    this.key = key
  }
}
