import { rawSongs } from '../songs/raw-songs'
import { RawSong } from '../interfaces/raw-song'
import { SongLoaderHelper } from './song-loader-helper'
import { Song } from '../interfaces/song'

declare let localforage: any

export function songLoader(/* dependencies */): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise((resolve, reject) => {

      const songs = []

      rawSongs.forEach((rawSong: RawSong) => {
        const song: Song = new SongLoaderHelper(rawSong).convert()
        songs.push(song)
      })

      localforage.setItem('songs', songs, err => {
        if (err) reject(err)
        resolve()
      })
    })
  }
}
