export interface RawSong {
  id: number,
  title: string,
  bible: string,
  youTube: string,
  labels: [string],
  verses: Array<{ chords: string, lyrics: string }>,
  choruses: Array<{ chords: string, lyrics: string }>,
  bridges: Array<{ chords: string, lyrics: string }>,
  order: [string]
}
