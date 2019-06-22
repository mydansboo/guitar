import { Chunk } from './chunk'

export interface Transpose {
  chunks: Array<Chunk>,
  score: number,
  firstChord: string,
  key: string
}
