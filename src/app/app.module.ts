import { BrowserModule } from '@angular/platform-browser'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SongComponent } from './routes/song/song.component'
import { HttpClientModule } from '@angular/common/http'
import { SongListComponent } from './routes/song-list/song-list.component'
import { YouTubeComponent } from './routes/you-tube/you-tube.component'
import { SafePipe } from './pipes/safe.pipe'
import { ExcerptPipe } from './pipes/excerpt.pipe'
import { BibleVerseComponent } from './shared/bible-verse/bible-verse.component'
import { CapitalisePipe } from './pipes/capitalise.pipe'
import { SongFooterComponent } from './shared/song-footer/song-footer.component'
import { LinksComponent } from './shared/links/links.component'
import { TransposeModalComponent } from './routes/song/transpose-modal/transpose-modal.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { songLoader } from './initialisers/song-loader'
import { SongErrorComponent } from './routes/song-error/song-error.component'

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    SongListComponent,
    YouTubeComponent,
    SafePipe,
    ExcerptPipe,
    BibleVerseComponent,
    CapitalisePipe,
    SongFooterComponent,
    LinksComponent,
    TransposeModalComponent,
    SongErrorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: songLoader,
      multi: true,
      deps: []
    }
  ],
  entryComponents: [
    TransposeModalComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {}
