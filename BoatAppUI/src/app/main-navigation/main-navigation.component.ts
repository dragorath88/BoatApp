import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Buffer } from 'buffer';

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

  // Gets the value of the unique_name claim from the token payload
  getUniqueNameValue(): string | null {
    const token = this._authService.getToken();
    if (token) {
      const payload: any = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      return payload.unique_name;
    }
    return null;
  }
}
