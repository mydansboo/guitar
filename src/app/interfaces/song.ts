import { Chunk } from './chunk'
import { RawSongError } from './raw-song-error'
import { Transpose } from './transpose'

export interface Song {
  id: number,
  title: string,
  bible: string,
  youTube: string,
  labels: [string],
  verses: Array<{ chords: string, lyrics: string }>,
  choruses: Array<{ chords: string, lyrics: string }>,
  bridges: Array<{ chords: string, lyrics: string }>,
  order: [string]
  chunks: Array<Chunk>,
  transpose: {
    A: Transpose,
    'A#': Transpose,
    B: Transpose,
    C: Transpose,
    'C#': Transpose,
    D: Transpose,
    'D#': Transpose,
    E: Transpose,
    F: Transpose,
    'F#': Transpose,
    G: Transpose,
    'G#': Transpose
  },
  errors: Array<RawSongError>,
  origBaseChord: string
}
