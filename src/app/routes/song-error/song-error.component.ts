import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Song } from '../../interfaces/song'
import { find } from 'lodash'

declare let localforage: any

@Component({
  selector: 'app-song-error',
  templateUrl: './song-error.component.html',
  styleUrls: ['./song-error.component.scss']
})

export class SongErrorComponent implements OnInit {

  private song: Song

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      localforage.getItem('songs', (err, songs) => {
        this.song = find(songs, {id})
        if (!this.song) {
          this.router.navigateByUrl('/list').then()
        } else if (!this.song.errors) this.router.navigateByUrl('/song/' + id).then()
      })
    })
  }
}
