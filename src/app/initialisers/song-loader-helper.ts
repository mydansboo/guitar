import { getMatches, indicesOfArray, indicesOfString } from '../utils/utils'
import { cloneDeep, intersection, isEqual, transform, uniq } from 'lodash'
import { RawSong } from '../interfaces/raw-song'
import { Song } from '../interfaces/song'
import { RawSongError } from '../interfaces/raw-song-error'
import { rawSongs } from '../songs/raw-songs'

const SPLITTER = '@'
// noinspection Annotator
const SPACE_AND_SPLITTER = new RegExp(`[ ${SPLITTER}]+`)
const VALID_CHORD_2_CHARS = ['m', 'm7', 'sus4', '7']
const NASTY_CHORD_2_CHARS = ['6']
const SEMITONES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

const CHORDS_SCORES = {
  score1: {
    name: 'easy',
    score: 1,
    chords: ['Em', 'Em7']
  },
  score2: {
    name: 'medium',
    score: 2,
    chords: ['A', 'Am', 'C', 'D', 'D7', 'E', 'G']
  },
  score3: {
    name: 'unknown',
    score: 3,
    chords: null
  },
  score4: {
    name: 'hard', // bar chords
    score: 4,
    chords: ['F']
  },
  score5: {
    name: 'ouch',
    score: 5,
    chords: ['A#', 'B']
  }
}

export class SongLoaderHelper {

  private rawSongErrorsShort: Array<RawSongError> = []
  private rawSongErrors: Array<RawSongError> = []
  private unknownChords: string[] = []

  constructor(private rawSong: RawSong) {
    this.checkSong()
  }

  private checkSong() {
    this.checkUniqueId()
    this.checkOrder()
    this.checkChords()
    this.checkChordSpacing()
    this.checkSplitters()
    this.logErrors()
  }

  private checkUniqueId() {
    const ids = rawSongs.map(song => song.id)
    const idxs = indicesOfArray(ids, this.rawSong.id)
    if (idxs.length !== 1) {
      this.addError(this.rawSong.title, 'id not unique')
    }
  }

  private checkOrder() {
    const {verses, choruses, bridges, order, title} = this.rawSong
    order.forEach((o, i) => {
      const what = o[0]
      const idx = parseInt(o[1], 10)
      let target
      if (what === 'v') target = verses[idx]
      if (what === 'c') target = choruses[idx]
      if (what === 'b') target = bridges[idx]
      if (!target) {
        this.addError(title, `order invalid at ${o}`)
      } else {
        if (i === 0) {
          if (!/[A-G]+/.test(target.chords[0])) this.addError(title, 'initial chord invalid')
        }
      }
    })
  }

  private checkChords() {
    const {verses, choruses, bridges, title} = this.rawSong
    const chords = [...verses, ...choruses, ...bridges].filter(what => what != null).map(what => what.chords)
    chords.forEach(c => {
      const chordsArray = c.split(SPACE_AND_SPLITTER).filter(x => x !== '')
      chordsArray.forEach(ca => {
        if (!/[A-G]+/.test(ca[0])) this.addError(title, `invalid chord ${ca}`)
        if (ca.length > 1) {
          if (ca.substring(0, 2) === 'B#' || ca.substring(0, 2) === 'E#') {
            this.addError(title, `invalid sharp chord ${ca}`)
          } else {
            let part2 = ca.substring(1)
            if (part2.startsWith('#')) part2 = part2.substring(1)
            if (part2.length) {
              if (NASTY_CHORD_2_CHARS.includes(part2)) {
                console.warn(`song warn - ${title} - nasty 2nd part in chord ${ca}`)
              } else {
                if (!VALID_CHORD_2_CHARS.includes(part2)) this.addError(title, `invalid 2nd part in chord ${ca}`)
              }
            }
          }
        }
      })
    })
  }

  private checkChordSpacing() {
    const {verses, choruses, bridges, title} = this.rawSong
    const chords = [...verses, ...choruses, ...bridges].filter(what => what != null).map(what => what.chords)
    chords.forEach(c => {
      while (c.replace(' ', '').length) {
        // @ts-ignore
        c = c.trimLeft()
        if (c[0] === SPLITTER) {
          c = c.substring(1)
        } else {
          let requiredSpaces = 2
          if (c.length > 1 && c[1] === '#') requiredSpaces = 1
          const chord = c.split(SPACE_AND_SPLITTER)[0]
          // @ts-ignore
          if (c.trimRight().length === chord.length) {
            c = ''
          } else {
            if (requiredSpaces === 2) {
              if (c[chord.length + 1] !== ' ') {
                c = ''
                this.addError(title, 'invalid chord spacing')
              } else {
                c = c.replace(chord, '')
              }
            } else {
              c = c.replace(chord, '')
            }
          }
        }
      }
    })
  }

  private checkSplitters() {
    const {verses, choruses, bridges, title} = this.rawSong
    const lines = [...verses, ...choruses, ...bridges].filter(what => what != null)
    lines.forEach(line => {
      const chordIdxs = indicesOfString(line.chords, SPLITTER)
      const lyricIdxs = indicesOfString(line.lyrics, SPLITTER)
      if (!isEqual(chordIdxs, lyricIdxs)) this.addError(title, 'invalid splitters')
    })
  }

  private logErrors() {
    this.rawSongErrors.forEach(err => {
      console.error(err.message)
    })
  }

  private addError(title, message) {
    this.rawSongErrorsShort.push({message})
    this.rawSongErrors.push({message: `song error - ${title} - ${message}`})
  }

  convert() {
    const song: Song = {
      id: this.rawSong.id,
      title: this.rawSong.title,
      bible: this.rawSong.bible,
      youTube: this.rawSong.youTube,
      labels: this.rawSong.labels,
      verses: this.rawSong.verses,
      choruses: this.rawSong.choruses,
      bridges: this.rawSong.bridges,
      order: this.rawSong.order,
      chunks: null,
      transpose: null,
      errors: null,
      origBaseChord: null
    }

    if (this.rawSongErrors.length) {
      song.errors = this.rawSongErrorsShort
    } else {
      song.chunks = this.setChunks()
      song.origBaseChord = this.getBaseChord(song.chunks[0].lines[0].chords.split(SPACE_AND_SPLITTER)[0])

      const semitoneAdjustForA = this.setSemitoneAdjustForA(song.origBaseChord)
      song.transpose = {
        A: this.setTranspose('A', song.chunks, semitoneAdjustForA),
        'A#': this.setTranspose('A#', song.chunks, semitoneAdjustForA + 1),
        B: this.setTranspose('B', song.chunks, semitoneAdjustForA + 2),
        C: this.setTranspose('C', song.chunks, semitoneAdjustForA + 3),
        'C#': this.setTranspose('C#', song.chunks, semitoneAdjustForA + 4),
        D: this.setTranspose('D', song.chunks, semitoneAdjustForA + 5),
        'D#': this.setTranspose('D#', song.chunks, semitoneAdjustForA + 6),
        E: this.setTranspose('E', song.chunks, semitoneAdjustForA + 7),
        F: this.setTranspose('F', song.chunks, semitoneAdjustForA + 8),
        'F#': this.setTranspose('F#', song.chunks, semitoneAdjustForA + 9),
        G: this.setTranspose('G', song.chunks, semitoneAdjustForA + 10),
        'G#': this.setTranspose('G#', song.chunks, semitoneAdjustForA + 11)
      }
    }

    if (this.unknownChords.length) {
      this.unknownChords = uniq(this.unknownChords).sort()
      console.warn(`unknown chords - ${song.title} - ${this.unknownChords.toString().replace(/,/g, ' ')}`)
    }

    return song
  }

  private setSemitoneAdjustForA(origBaseChord) {
    const semitone = this.getBaseChord(origBaseChord)
    return -SEMITONES.indexOf(semitone)
  }

  private getBaseChord(chord) {
    let baseChord = chord[0]
    if (chord.length > 1 && chord[1] === '#') baseChord += '#'
    return baseChord
  }

  private setTranspose(key, chunks, semitoneAdjust) {

    let score = 0
    let chordCount = 0
    let firstChord = null

    const regex = /([a-zA-Z0-9#]+)/g

    chunks = cloneDeep(chunks)

    chunks = chunks.map(chunk => {
      chunk.lines = chunk.lines.map(line => {
        const origChords = getMatches(line.chords, regex)
        chordCount += origChords.length
        origChords.forEach(origChord => {
          const newChord = this.getAdjustedChord(origChord, semitoneAdjust)
          if (firstChord == null) firstChord = newChord
          const scoreData = this.getScoreData(newChord)
          score += scoreData.score

          if (newChord.length === origChord.length) {
            line.chords = line.chords.replace(new RegExp(`${origChord} `), `<span class="chord ${scoreData.name}">${newChord}</span> `)
          } else if (newChord.length > origChord.length) {
            line.chords = line.chords.replace(new RegExp(`${origChord} `), `<span class="chord ${scoreData.name}">${newChord}</span>`)
          } else if (newChord.length < origChord.length) {
            line.chords = line.chords.replace(new RegExp(`${origChord} `), `<span class="chord ${scoreData.name}">${newChord}</span>  `)
          }
        })
        return line
      })
      return chunk
    })

    return {chunks, score: score / chordCount, firstChord, key}
  }

  private getScoreData(chord) {
    let scoreData
    if (CHORDS_SCORES.score1.chords.includes(chord)) {
      scoreData = CHORDS_SCORES.score1
    } else if (CHORDS_SCORES.score2.chords.includes(chord)) {
      scoreData = CHORDS_SCORES.score2
    } else if (CHORDS_SCORES.score4.chords.includes(chord)) {
      scoreData = CHORDS_SCORES.score4
    } else if (CHORDS_SCORES.score5.chords.includes(chord)) {
      scoreData = CHORDS_SCORES.score5
    } else {
      scoreData = CHORDS_SCORES.score3
      this.unknownChords.push(chord)
    }

    return {
      score: scoreData.score,
      name: scoreData.name
    }
  }

  private getAdjustedChord(chord, semitoneAdjust) {
    let baseChord = chord[0]
    if (chord.length > 1 && chord[1] === '#') baseChord += '#'
    const part2 = chord.substring(baseChord.length)
    const baseChordIdx = SEMITONES.indexOf(baseChord)
    let newChordIdx = baseChordIdx + semitoneAdjust
    if (newChordIdx < 0) newChordIdx = newChordIdx + SEMITONES.length
    if (newChordIdx > SEMITONES.length - 1) newChordIdx = newChordIdx - SEMITONES.length
    if (SEMITONES[newChordIdx] == null) {
      console.log('chord', chord)
      console.log('semitoneAdjust', semitoneAdjust)
      console.log('baseChord', baseChord)
      console.log('part2', part2)
      console.log('baseChordIdx', baseChordIdx)
      console.log('newChordIdx', newChordIdx)
    }
    return SEMITONES[newChordIdx] + part2
  }

  private setChunks() {
    let chunks
    chunks = this.getChunks()
    chunks = chunks.map((chunk) => {
      chunk.lines = this.chopLinesOnSymbol(chunk.lines)
      return chunk
    })
    return chunks
  }

  private getChunks() {
    const {verses, choruses, bridges, order} = this.rawSong
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
      const idxs1 = indicesOfString(line.chords, SPLITTER)
      const idxs2 = indicesOfString(line.lyrics, SPLITTER)
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
    return line
  }
}
