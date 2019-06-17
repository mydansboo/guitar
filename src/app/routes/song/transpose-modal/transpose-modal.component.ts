import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'

@Component({
  selector: 'app-transpose-modal',
  templateUrl: './transpose-modal.component.html',
  styleUrls: ['./transpose-modal.component.scss']
})

export class TransposeModalComponent implements OnInit {

  @ViewChild('okButton') okButton
  @Input() key: string
  @Output() change = new EventEmitter<{ key: string, close: boolean }>()

  origKey: string

  ngOnInit() {
    this.origKey = this.key
  }

  onOk() {
    this.change.emit({key: null, close: true})
  }

  onCancel() {
    this.change.emit({key: this.origKey, close: true})
  }

  setKey(key) {
    this.change.emit({key, close: false})
    this.key = key
  }

  onEasy() {
    console.log('onEasy')
  }
}
