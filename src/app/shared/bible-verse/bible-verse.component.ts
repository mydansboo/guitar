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

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://bible-api.com/' + this.bible).subscribe((res: any) => {
      this.verse = res.text + ' ' + res.reference.toUpperCase()
    })
  }
}
