import { Component, OnInit } from '@angular/core'
import { songs } from '../songs/songs'
import { ActivatedRoute } from '@angular/router'
import { find } from 'lodash'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-you-tube',
  templateUrl: './you-tube.component.html',
  styleUrls: ['./you-tube.component.scss']
})

export class YouTubeComponent implements OnInit {

  song: any
  bible: string

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      this.song = find(songs, {id})
      this.setBible()
    })
  }

  private setBible() {
    this.http.get('https://bible-api.com/' + this.song.bible).subscribe((res: any) => {
      this.bible = res.text + ' ' + res.reference.toUpperCase()
    })
  }
}
