import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoatsListComponent } from './boats-list/boats-list.component';
import { BoatEditComponent } from './boat-edit/boat-edit.component';

const routes: Routes = [
  { path: '', component: BoatsListComponent, pathMatch: 'full' },
  { path: 'boats-list', component: BoatsListComponent },
  { path: 'edit-boat/:id', component: BoatEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
