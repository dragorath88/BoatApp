import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.scss'],
})
export class MainNavigationComponent {
  // Observable that checks if the device is a handset
  isHandset$: Observable<boolean> = this._breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _authService: AuthService
  ) {}

  // Signs the user out
  signOut(): void {
    this._authService
      .signOut()
      .pipe(
        catchError((error) => {
          console.error('Error:', error);
          return [];
        })
      )
      .subscribe();
  }
}
