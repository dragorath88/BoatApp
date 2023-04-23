import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './sign-in.component.html',
})
export class SignInComponent {
  username!: string;
  password!: string;
  errorMessage!: string;

  constructor(
    private _authService: AuthService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

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
