import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core'
import { sortBy } from 'lodash'

@Component({
  selector: 'app-transpose-modal',
  templateUrl: './transpose-modal.component.html',
  styleUrls: ['./transpose-modal.component.scss']
})

export class TransposeModalComponent implements OnInit {

  @ViewChild('okButton') okButton
  @Input() defaultKey: string
  @Input() key: string
  @Input() transpose: any
  @Output() change = new EventEmitter<{ key: string, close: boolean }>()

  diff: number
  origKey: string

  ngOnInit() {
    this.origKey = this.key
    this.setKeyAndDiff(this.origKey)
  }

  onOk() {
    this.change.emit({key: null, close: true})
  }

  onCancel() {
    this.change.emit({key: this.origKey, close: true})
  }

  setKey(key) {
    this.change.emit({key, close: false})
    this.setKeyAndDiff(key)
  }

  onEasy() {
    const sortedByScore = sortBy(this.transpose, 'score')
    const key = sortedByScore[0].key
    this.setKey(key)
  }

  onDefault() {
    this.setKey(this.defaultKey)
  }

  private setKeyAndDiff(key) {
    this.key = key
    this.diff = this.transpose[key].score
  }
}
