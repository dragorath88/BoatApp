import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserApiService } from '../services/auth/user-api/user-api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  constructor(
    private _userService: UserApiService,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    this.signUpForm = this._formBuilder.group(
      {
        username: ['', [Validators.required]],
        password: [
          '',
          [Validators.required, Validators.pattern(this.passwordPattern)],
        ],
        confirmpassword: ['', [Validators.required]],
      },
      { validator: this.checkPasswords }
    );
  }

  passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  signUpForm: FormGroup;

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmpassword')?.value;

    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  onSubmit(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    const formValues = this.signUpForm.value;
    this._userService
      .signUp(
        formValues.username,
        formValues.password,
        formValues.confirmpassword
      )
      .subscribe({
        next: (result) => {
          this._router.navigate(['/sign-in']);
          this._snackbar.open('Account created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          if (err.error && !err.error.errors) {
            this._snackbar.open(err.error, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          } else {
            console.log(err);
          }
        },
      });
  }
}
