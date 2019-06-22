import { Component, HostListener, OnInit } from '@angular/core'
import { find } from 'lodash'
import { ActivatedRoute, Router } from '@angular/router'
import { LocalStorageService } from '../../services/local-storage.service'
import { Modes } from 'src/app/interfaces/modes'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { TransposeModalComponent } from './transpose-modal/transpose-modal.component'
import { Song } from 'src/app/interfaces/song'
import { Transpose } from 'src/app/interfaces/transpose'

declare let localforage: any

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})

export class SongComponent implements OnInit {

  song: Song
  transpose: Transpose

  mode = localStorage.getItem('mode') || 'scroll'
  showChords = true
  chunkNo = 0
  modes: Modes
  key: string
  isFullScreen = false
  hideStuff = false

  constructor(private route: ActivatedRoute, private localStorageService: LocalStorageService, private modalService: NgbModal, private router: Router) {}

  ngOnInit() {

    const showChords = this.localStorageService.getItem('show-chords')
    if (showChords != null) this.showChords = showChords

    this.route.paramMap.subscribe(params => {

      const id = parseInt(params.get('id'), 10)
      localforage.getItem('songs', (err, songs) => {
        this.song = find(songs, {id})
        if (!this.song) {
          this.router.navigateByUrl('/list').then()
        } else if (this.song.errors) {
          this.router.navigateByUrl('/song-error/' + id).then()
        } else {
          this.modes = this.loadSongModes()
          const key = localStorage.getItem('song-' + this.song.id + '-key') || this.song.origBaseChord
          this.transpose = this.song.transpose[key]
          this.key = key
        }
      })
    })
  }

  toggleHideStuff() {
    this.hideStuff = !this.hideStuff
  }

  @HostListener('window:resize', ['$event'])
  onResize(evt) {
    // @ts-ignore
    this.isFullScreen = window.fullScreen || (window.innerWidth === screen.width && window.innerHeight === screen.height)
  }

  fullScreen() {
    const el = document.documentElement

    if (el.requestFullscreen) {
      el.requestFullscreen()
      // @ts-ignore
    } else if (el.mozRequestFullScreen) { /* Firefox */
      // @ts-ignore
      el.mozRequestFullScreen()
      // @ts-ignore
    } else if (el.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
      // @ts-ignore
      el.webkitRequestFullscreen()
      // @ts-ignore
    } else if (el.msRequestFullscreen) { /* IE/Edge */
      // @ts-ignore
      el.msRequestFullscreen()
    }
  }

  exitFullScreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen()
      // @ts-ignore
    } else if (document.mozCancelFullScreen) {
      // @ts-ignore
      document.mozCancelFullScreen()
      // @ts-ignore
    } else if (document.webkitExitFullscreen) {
      // @ts-ignore
      document.webkitExitFullscreen()
      // @ts-ignore
    } else if (document.msExitFullscreen) {
      // @ts-ignore
      document.msExitFullscreen()
    }
  }

  changeKey() {
    const modal = this.modalService.open(TransposeModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'transpose-modal'
    })
    modal.componentInstance.transpose = this.song.transpose
    modal.componentInstance.key = this.key
    modal.componentInstance.defaultKey = this.song.origBaseChord
    modal.componentInstance.change.subscribe((change) => {
      const key = change.key
      if (key) {
        this.transpose = this.song.transpose[key]
        this.key = key
        localStorage.setItem('song-' + this.song.id + '-key', key)
      }
      if (change.close) modal.close()
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
    if (this.modes[this.mode].fontSize < 50) {
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
    if (this.chunkNo < this.transpose.chunks.length - 1) {
      this.chunkNo++
    }
  }

  setChunk(chunk) {
    this.chunkNo = chunk
  }
}
