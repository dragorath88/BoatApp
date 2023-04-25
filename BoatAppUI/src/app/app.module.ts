import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

// Application Modules
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './services/guard/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { BoatCreateComponent } from './boat-create/boat-create.component';
import { BoatDeleteModalComponent } from './boat-delete-modal/boat-delete-modal.component';
import { BoatDetailModalComponent } from './boat-detail-modal/boat-detail-modal.component';
import { BoatEditComponent } from './boat-edit/boat-edit.component';
import { BoatsListComponent } from './boats-list/boats-list.component';
import { MainNavigationComponent } from './main-navigation/main-navigation.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserApiService } from './services/auth/user-api/user-api.service';
import { JwtInterceptor } from './services/auth/jwt-interceptor.service';
import { FadeInUpStaggerElementDirective } from './shared/animations/fade-in-up.animations';

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
    FadeInUpStaggerElementDirective,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,

    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
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
