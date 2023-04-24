import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BoatEditComponent } from './boat-edit/boat-edit.component';
import { BoatsListComponent } from './boats-list/boats-list.component';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BoatDeleteModalComponent } from './boat-delete-modal/boat-delete-modal.component';
import { BoatDetailModalComponent } from './boat-detail-modal/boat-detail-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SignInComponent } from './sign-in/sign-in.component';

import { AuthService } from './services/auth/auth.service';
import { AuthGuard } from './services/guard/auth.guard';
import { BoatCreateComponent } from './boat-create/boat-create.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { JwtInterceptor } from './services/auth/jwt-interceptor.service';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UserApiService } from './services/auth/user-api/user-api.service';

@NgModule({
  declarations: [
    AppComponent,
    BoatsListComponent,
    BoatEditComponent,
    BoatDeleteModalComponent,
    BoatDetailModalComponent,
    SignInComponent,
    BoatCreateComponent,
    MainNavigationComponent,
    SignUpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    // Material
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatGridListModule,
    MatSnackBarModule,
  ],
  providers: [
    AuthService,
    UserApiService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
