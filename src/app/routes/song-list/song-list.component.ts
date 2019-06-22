import { Component, OnInit } from '@angular/core'
import { Song } from 'src/app/interfaces/song'
import { sortBy } from 'lodash'

declare let localforage: any

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})

export class SongListComponent implements OnInit {

  songs: Array<Song>

  ngOnInit() {
    localforage.getItem('songs', (err, songs) => {
      songs = sortBy(songs, 'title')
      this.songs = songs.map(song => {
        song.key = localStorage.getItem('song-' + song.id + '-key') || song.origBaseChord
        return song
      })
    })
  }
}
