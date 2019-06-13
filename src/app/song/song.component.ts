import {Component, OnInit} from '@angular/core';
import hereIAmToWorship from './here-i-am-to-worship.json';
import isntHeBeautiful from './isnt-he-beautiful.json';


@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  song;

  get lyrics() {
    const {verses, choruses, order} = this.song;
    const lyrics = order.map(o => {
      const what = o[0];
      const idx = o[1] * 1;
      if (what === 'v') {
        return verses[idx];
      }
      if (what === 'c') {
        return choruses[idx];
      }
    });
    return lyrics;
  }

  constructor() {
  }

  ngOnInit() {
    this.song = isntHeBeautiful;
  }

  song1() {
    this.song = hereIAmToWorship;
  }

  song2() {
    this.song = isntHeBeautiful;
  }
}
