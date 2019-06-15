import { Component, Input, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-bible-verse',
  templateUrl: './bible-verse.component.html',
  styleUrls: ['./bible-verse.component.scss']
})

export class BibleVerseComponent implements OnInit {

  @Input() bible
  verse: string
  ref: string
  translation: { abbr: string, name: string } = {abbr: null, name: null}

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://bible-api.com/' + encodeURIComponent(this.bible)).subscribe((res: any) => {
      this.verse = res.text
      this.ref = res.reference.toUpperCase()
      this.translation.abbr = res.translation_id.toUpperCase()
      this.translation.name = res.translation_name
    })
  }
}
