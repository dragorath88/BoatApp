import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoatsListComponent } from './boats-list/boats-list.component';
import { BoatEditComponent } from './boat-edit/boat-edit.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './services/guard/auth.guard';
import { BoatCreateComponent } from './boat-create/boat-create.component';
import { BoatDetailModalComponent } from './boat-detail-modal/boat-detail-modal.component';

const routes: Routes = [
  {
    path: '',
    component: BoatsListComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  {
    path: 'boats-list',
    component: BoatsListComponent,
    canActivate: [AuthGuard],
  },
  { path: 'boat-detail/:id', component: BoatDetailModalComponent },
  {
    path: 'edit-boat/:id',
    component: BoatEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'sign-in', component: SignInComponent },
  { path: 'boat-create', component: BoatCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
