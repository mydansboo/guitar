import { Component } from '@angular/core'
import { songs } from '../songs/songs'
import { sortBy } from 'lodash'

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})

export class SongListComponent {
  songs = sortBy(songs, 'title')
}
