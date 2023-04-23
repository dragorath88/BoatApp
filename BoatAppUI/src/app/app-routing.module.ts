import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoatsListComponent } from './boats-list/boats-list.component';
import { BoatEditComponent } from './boat-edit/boat-edit.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthGuard } from './services/guard/auth.guard';

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
  {
    path: 'edit-boat/:id',
    component: BoatEditComponent,
    canActivate: [AuthGuard],
  },
  { path: 'sign-in', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
