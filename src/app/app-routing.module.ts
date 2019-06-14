import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SongComponent } from './routes/song/song.component'
import { SongListComponent } from './routes/song-list/song-list.component'

const routes: Routes = [
  {path: 'song/:id', component: SongComponent},
  {path: 'list', component: SongListComponent},
  {path: '**', redirectTo: '/list', pathMatch: 'full'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
