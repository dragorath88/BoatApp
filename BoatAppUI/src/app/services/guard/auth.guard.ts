import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Determines whether the user can activate a route or not
   * @param route The activated route
   * @param state The router state
   * @returns An observable of boolean or UrlTree that indicates whether the user can access the route or not
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return of(this.authService.isAuthenticated()).pipe(
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true;
        } else {
          // User is not logged in, navigate to the sign-in page.
          return this.router.createUrlTree(['/sign-in'], {
            queryParams: { returnUrl: state.url },
          });
        }
      })
    );
  }
}
