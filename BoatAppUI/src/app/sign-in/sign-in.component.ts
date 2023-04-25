import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { fadeInUpAnimation } from '../shared/animations/fade-in-up.animations';

/**
 * Component that displays a sign-in form and handles user sign-in
 */
@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  animations: [fadeInUpAnimation],
})
export class SignInComponent {
  /**
   * The username entered in the sign-in form
   */
  username!: string;

  /**
   * The password entered in the sign-in form
   */
  password!: string;

  /**
   * The error message to display if sign-in fails
   */
  errorMessage!: string;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  /**
   * Attempts to sign in the user using the credentials entered in the form
   */
  onSubmit() {
    this._authService
      .signIn(this.username, this.password)
      .subscribe((result) => {
        if (result) {
          const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
          this._router.navigate([returnUrl || '/']);
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      });
  }
}
