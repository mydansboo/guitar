import { Component, OnInit } from '@angular/core'
import { find, intersection, transform } from 'lodash'
import { indicesOf } from '../../utils/utils'
import { songs } from '../songs/songs'
import { ActivatedRoute } from '@angular/router'
import { LocalStorageService } from '../../services/local-storage.service'
import { Chunk } from 'src/app/interfaces/chunk'
import { Song } from 'src/app/interfaces/song'

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
  chunkNo = 0
  modes: {
    scroll: {
      fontSize: number
    },
    slides: {
      fontSize: number
    }
  }

  constructor(private route: ActivatedRoute, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      const song = find(songs, {id})
      this.setSong(song)
      this.modes = this.loadSongModes()
    })
  }

  setMode(mode) {
    this.chunkNo = 0
    this.mode = mode
    localStorage.setItem('mode', mode)
  }

  incrementFontSize() {
    if (this.modes[this.mode].fontSize < 60) {
      this.modes[this.mode].fontSize++
      this.saveSongModes()
    }
  }

  decrementFontSize() {
    if (this.modes[this.mode].fontSize > 10) {
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
    console.log('chunks', chunks)
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
          const chords = line.chords.substring(idx1, idx2)
          const lyrics = line.lyrics.substring(idx1, idx2)
          const splitLine = {
            ...line,
            chords: chords.startsWith(SPLITTER) ? chords.substring(1) : chords,
            lyrics: lyrics.startsWith(SPLITTER) ? lyrics.substring(1) : lyrics
          }
          result.push(splitLine)
        }
      } else {
        result.push(line)
      }
    }, [])
    return lines
  }
}
