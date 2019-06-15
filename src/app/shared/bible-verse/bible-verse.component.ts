import { Component, Input, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { LocalStorageService } from '../../services/local-storage.service'

@Component({
  selector: 'app-bible-verse',
  templateUrl: './bible-verse.component.html',
  styleUrls: ['./bible-verse.component.scss']
})

export class BibleVerseComponent implements OnInit {

  @Input() bible
  verse: {
    text: string,
    ref: string,
    translation: { abbr: string, name: string }
  }

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  ngOnInit() {

    const bibleKey = 'bible-' + this.bible.toLowerCase().replace(' ', '')

    this.verse = this.localStorageService.getItem(bibleKey)

    if (!this.verse) {
      this.http.get('https://bible-api.com/' + encodeURIComponent(this.bible)).subscribe((res: any) => {
        this.verse = {
          text: res.text,
          ref: res.reference.toUpperCase(),
          translation: {
            abbr: res.translation_id.toUpperCase(),
            name: res.translation_name
          }
        }
        this.localStorageService.setItem(bibleKey, this.verse)
      })
    }
  }
}
