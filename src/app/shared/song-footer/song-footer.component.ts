import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-song-footer',
  templateUrl: './song-footer.component.html',
  styleUrls: ['./song-footer.component.scss']
})

export class SongFooterComponent {
  @Input() fontSize: number
  @Input() key: string
  @Input() showChords: boolean
  @Input() title: string
  @Input() hideStuff: boolean = null

  @Output() unhide = new EventEmitter<boolean>()

  onUnhide() {
    this.unhide.emit(true)
  }
}
