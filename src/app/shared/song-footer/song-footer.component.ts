import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-song-footer',
  templateUrl: './song-footer.component.html',
  styleUrls: ['./song-footer.component.scss']
})

export class SongFooterComponent {
  @Input() key: string
  @Input() title: string
  @Input() fontSize: number
}
