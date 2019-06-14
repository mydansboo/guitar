import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { SongComponent } from './routes/song/song.component'
import { HttpClientModule } from '@angular/common/http'
import { SongListComponent } from './routes/song-list/song-list.component';
import { YouTubeComponent } from './routes/you-tube/you-tube.component';
import { SafePipe } from './pipes/safe.pipe'

@NgModule({
  declarations: [
    AppComponent,
    SongComponent,
    SongListComponent,
    YouTubeComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule {}
