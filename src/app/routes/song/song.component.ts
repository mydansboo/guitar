import { Component, OnInit } from '@angular/core'
import { find, transform } from 'lodash'
import { indicesOf } from '../../utils/utils'
import { songs } from '../songs/songs'
import { ActivatedRoute } from '@angular/router'

const MAX_LINE_LENGTH = 150

interface Song {
  id: number,
  title: string,
  bible: string,
  youTube: string,
  verses: Array<{ chords: string, lyrics: string }>,
  choruses: Array<{ chords: string, lyrics: string }>,
  bridges: Array<{ chords: string, lyrics: string }>,
  order: [string]
}

interface Chunk {
  lines: Array<{ chords: string, lyrics: string }>,
  type: string
}

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
  modes = {
    scroll: {
      fontSize: 20
    },
    slides: {
      fontSize: 20
    }
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = parseInt(params.get('id'), 10)
      const song = find(songs, {id})
      this.setSong(song)
    })
  }

  setMode(mode) {
    this.chunkNo = 0
    this.mode = mode
    localStorage.setItem('mode', mode)
  }

  incrementFontSize() {
    this.modes[this.mode].fontSize ++
  }

  decrementFontSize() {
    this.modes[this.mode].fontSize --
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
    console.log(this.song)
    this.setChunks()
  }

  private setChunks() {
    let chunks
    chunks = this.getChunks()
    chunks = chunks.map((chunk) => {
      chunk.lines = this.chopLinesOnFullstops(chunk.lines)
      return chunk
    })
    chunks = chunks.map((chunk) => {
      chunk.lines = this.chopLinesInHalf(chunk.lines)
      return chunk
    })
    console.log(chunks[0])
    this.chunks = chunks
  }

  private getChunks() {
    const {verses, choruses, bridges, order} = this.song
    const lines = order.map(o => {
      const what = o[0]
      const idx = parseInt(o[1], 10)
      if (what === 'v') {
        return {
          lines: [verses[idx]],
          type: 'verse'
        }
      }
      if (what === 'c') {
        return {
          lines: [choruses[idx]],
          type: 'chorus'
        }
      }
      if (what === 'b') {
        return {
          lines: [bridges[idx]],
          type: 'bridge'
        }
      }

    })
    return lines
  }

  private chopLinesOnFullstops(lines) {
    lines = transform(lines, (result, line) => {
      let idxs
      idxs = indicesOf(line.lyrics, '. ').map(i => i + 2)
      idxs = idxs.map(idx => {
        while (line.lyrics.charAt(idx - 1) !== ' ' || line.chords.charAt(idx - 1) !== ' ') {idx++}
        return idx
      })
      if (idxs.length) {
        if (idxs[idxs.length - 1] === line.lyrics.length) {idxs.pop()}
        if (idxs.length) {
          idxs = [0, ...idxs, line.lyrics.length]
          for (let i = 0; i < idxs.length - 1; i++) {
            const idx1 = idxs[i]
            const idx2 = idxs[i + 1]
            const splitLine = {
              ...line,
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
          ...line,
          chords: line.chords.substring(0, idx),
          lyrics: line.lyrics.substring(0, idx)
        }
        result.push(line1)
        const line2 = {
          ...line,
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
