import { Component, OnInit } from '@angular/core'
import { cloneDeep, find, intersection, transform } from 'lodash'
import { getMatches, indicesOf } from '../../utils/utils'
import { songs } from '../songs/songs'
import { ActivatedRoute } from '@angular/router'
import { LocalStorageService } from '../../services/local-storage.service'
import { Chunk } from 'src/app/interfaces/chunk'
import { Song } from 'src/app/interfaces/song'
import { Modes } from 'src/app/interfaces/modes'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TransposeModalComponent } from './transpose-modal/transpose-modal.component'

const SPLITTER = '@'

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})

export class SongComponent implements OnInit {

  song: Song
  chunks: Array<Chunk>
  mode = localStorage.getItem('mode') || 'scroll'
  showChords = true
  chunkNo = 0
  modes: Modes
  key: string

  constructor(private route: ActivatedRoute, private localStorageService: LocalStorageService, private modalService: NgbModal) {}

  ngOnInit() {

    const showChords = this.localStorageService.getItem('show-chords')
    if (showChords != null) this.showChords = showChords

    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      const song = find(songs, {id})
      this.setSong(song)
      this.modes = this.loadSongModes()
    })
  }

  changeKey() {
    const modal = this.modalService.open(TransposeModalComponent, {centered: true, backdrop: 'static', keyboard: false})
    modal.componentInstance.key = this.key
    modal.componentInstance.cancel.subscribe(() => {
      modal.close()
    })
    modal.componentInstance.ok.subscribe((key) => {
      console.log('new key is', key)
      modal.close()
    })
  }

  setMode(mode) {
    this.chunkNo = 0
    this.mode = mode
    localStorage.setItem('mode', mode)
  }

  toggleChords() {
    this.showChords = !this.showChords
    this.localStorageService.setItem('show-chords', this.showChords)
  }

  incrementFontSize() {
    if (this.modes[this.mode].fontSize < 60) {
      this.modes[this.mode].fontSize++
      this.saveSongModes()
    }
  }

  decrementFontSize() {
    if (this.modes[this.mode].fontSize > 20) {
      this.modes[this.mode].fontSize--
      this.saveSongModes()
    }
  }

  private loadSongModes() {
    return this.localStorageService.getItem('song-' + this.song.id + '-modes') || {
      scroll: {
        fontSize: 20
      },
      slides: {
        fontSize: 20
      }
    }
  }

  private saveSongModes() {
    this.localStorageService.setItem('song-' + this.song.id + '-modes', this.modes)
  }

  prev() {
    if (this.chunkNo > 0) {
      this.chunkNo--
    }
  }

  slides() {
    if (this.chunkNo < this.chunks.length - 1) {
      this.chunkNo++
    }
  }

  setChunk(chunk) {
    this.chunkNo = chunk
  }

  private setSong(song) {
    this.song = song
    this.setChunks()
  }

  private setChunks() {
    let chunks
    chunks = this.getChunks()
    chunks = chunks.map((chunk) => {
      chunk.lines = this.chopLinesOnSymbol(chunk.lines)
      return chunk
    })
    this.chunks = chunks
  }

  private getChunks() {
    const {verses, choruses, bridges, order} = this.song
    const chunks = order.map(o => {
      const what = o[0]
      const idx = parseInt(o[1], 10)
      if (what === 'v') {
        return {
          lines: [verses[idx]],
          type: 'verse',
          number: idx + 1,
          count: verses.length
        }
      }
      if (what === 'c') {
        return {
          lines: [choruses[idx]],
          type: 'chorus',
          number: idx + 1,
          count: choruses.length
        }
      }
      if (what === 'b') {
        return {
          lines: [bridges[idx]],
          type: 'bridge',
          number: idx + 1,
          count: bridges.length
        }
      }
    })
    return chunks
  }

  private chopLinesOnSymbol(lines) {
    lines = transform(lines, (result, line) => {
      const idxs1 = indicesOf(line.chords, SPLITTER)
      const idxs2 = indicesOf(line.lyrics, SPLITTER)
      let idxs = intersection(idxs1, idxs2)
      if (idxs.length) {
        const lineLength = Math.max(line.lyrics.length, line.chords.length)
        idxs = [0, ...idxs, lineLength]
        for (let i = 0; i < idxs.length - 1; i++) {
          const idx1 = idxs[i]
          const idx2 = idxs[i + 1]
          let chords = line.chords.substring(idx1, idx2)
          let lyrics = line.lyrics.substring(idx1, idx2)
          if (chords.startsWith(SPLITTER)) chords = chords.substring(1)
          if (lyrics.startsWith(SPLITTER)) lyrics = lyrics.substring(1)
          const choppedLine = {chords, lyrics}
          result.push(this.tidyLine(choppedLine))
        }
      } else {
        result.push(this.tidyLine(line))
      }
    }, [])
    return lines
  }

  private tidyLine(line) {
    line = cloneDeep(line)
    line.chords = line.chords.trimRight()
    line.lyrics = line.lyrics.trimRight()
    line.chords = line.chords + ' '
    line.lyrics = line.lyrics + ' '
    const regex = /([a-zA-Z0-9#]+)/g
    const matches = getMatches(line.chords, regex)
    if (!this.key) this.key = matches[0]
    matches.forEach(match => {
      line.chords = line.chords.replace(new RegExp(`${match} `), `<span class="chord chord-orig-${match}">${match}</span> `)
    })
    return line
  }
}
