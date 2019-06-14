import { Component, OnInit } from '@angular/core'
import { find, transform } from 'lodash'
import { indicesOf } from '../../utils/utils'
import { HttpClient } from '@angular/common/http'
import { songs } from '../songs/songs'
import { ActivatedRoute } from '@angular/router'

const MAX_LINE_LENGTH = 150

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})

export class SongComponent implements OnInit {

  bible
  song
  lines

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      const song = find(songs, {id})
      this.setSong(song)
    })
  }

  private setSong(song) {
    this.song = song
    this.setLines()
    this.setBible()
  }

  private setBible() {
    this.http.get('https://bible-api.com/' + this.song.bible).subscribe((res: any) => {
      this.bible = res.text + ' ' + res.reference.toUpperCase()
    })
  }

  private setLines() {
    let lines
    lines = this.getLines()
    lines = this.chopLinesOnFullstops(lines)
    lines = this.chopLinesInHalf(lines)
    this.lines = lines
  }

  private getLines() {
    const {verses, choruses, order} = this.song
    const lines = order.map(o => {
      const what = o[0]
      const idx = o[1] * 1
      if (what === 'v') {
        return {
          ... verses[idx],
          type: 'verse'
        }
      }
      if (what === 'c') {
        return {
          ... choruses[idx],
          type: 'chorus'
        }
      }
    })
    return lines
  }

  private chopLinesOnFullstops(lines) {
    lines = transform(lines, (result, line) => {
      let idxs = indicesOf(line.lyrics, '. ').map(i => i + 2)
      if (idxs.length) {
        if (idxs[idxs.length - 1] === line.lyrics.length) {idxs.pop()}
        if (idxs.length) {
          idxs = [0, ...idxs, line.lyrics.length]
          for (let i = 0; i < idxs.length - 1; i++) {
            const idx1 = idxs[i]
            const idx2 = idxs[i + 1]
            const splitLine = {
              ... line,
              chords: line.chords.substring(idx1, idx2),
              lyrics: line.lyrics.substring(idx1, idx2)
            }
            result.push(splitLine)
          }
        } else {
          result.push(line)
        }
      } else {
        result.push(line)
      }
    }, [])
    return lines
  }

  private chopLinesInHalf(lines) {
    let change = false
    lines = transform(lines, (result, line) => {
      if (line.lyrics.length > MAX_LINE_LENGTH) {
        let idx = Math.round(line.lyrics.length / 2) + 1
        while (line.lyrics.charAt(idx - 1) !== ' ' || line.chords.charAt(idx - 1) !== ' ') {idx++}
        const line1 = {
          ... line,
          chords: line.chords.substring(0, idx),
          lyrics: line.lyrics.substring(0, idx)
        }
        result.push(line1)
        const line2 = {
          ... line,
          chords: line.chords.substring(idx),
          lyrics: line.lyrics.substring(idx)
        }
        result.push(line2)
        change = true
      } else {
        result.push(line)
      }
    }, [])
    return !change ? lines : this.chopLinesInHalf(lines)
  }
}
