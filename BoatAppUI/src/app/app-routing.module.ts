/**
 * Routes for the application
 */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guard/auth.guard';
import { BoatCreateComponent } from './boat-create/boat-create.component';
import { BoatDetailModalComponent } from './boat-detail-modal/boat-detail-modal.component';
import { BoatEditComponent } from './boat-edit/boat-edit.component';
import { BoatsListComponent } from './boats-list/boats-list.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    component: SignInComponent,
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: '',
    component: MainNavigationComponent,
    children: [
      {
        path: 'boats-list',
        component: BoatsListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'boat-create',
        component: BoatCreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'boat-edit/:id',
        component: BoatEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'boat-detail/:id',
        component: BoatDetailModalComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
