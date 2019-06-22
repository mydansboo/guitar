export interface Chunk {
  lines: Array<{ chords: string, lyrics: string }>,
  type: string,
  lastChord: string
}
