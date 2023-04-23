import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

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
@NgModule({
  declarations: [
    AppComponent,
    BoatsListComponent,
    BoatEditComponent,
    BoatDeleteModalComponent,
    BoatDetailModalComponent,
    SignInComponent,
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
  ],
  providers: [AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
