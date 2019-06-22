import { Component, OnInit } from '@angular/core'
import { rawSongs } from '../../songs/raw-songs'
import { ActivatedRoute, Router } from '@angular/router'
import { find } from 'lodash'
import { HttpClient } from '@angular/common/http'

declare let localforage: any

@Component({
  selector: 'app-you-tube',
  templateUrl: './you-tube.component.html',
  styleUrls: ['./you-tube.component.scss']
})

export class YouTubeComponent implements OnInit {

  song: any

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      localforage.getItem('songs', (err, songs) => {
        this.song = find(songs, {id})
        if (!this.song) {
          this.router.navigateByUrl('/list').then()
        } else if (!this.song.youTube) {
          this.router.navigateByUrl('/song/' + id).then()
        }
      })
      this.song = find(rawSongs, {id})
    })
  }
}
