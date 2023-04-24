import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '../services/auth/user-api/user-api.service';

/**
 * Component that displays the sign-up form
 */
@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  /*
   * Password must contain at least 8 characters with at least
   *  one uppercase letter,
   *  one lowercase letter,
   *  one number,
   *  and one special character (@$!%*?&).
   */
  passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  signUpForm: FormGroup;

  constructor(
    private _userService: UserApiService,
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    // Initialize the sign-up form with form fields and validation rules
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

  /**
   * Custom validator that checks whether the password and confirm password fields match
   * @param group The form group that contains the password and confirm password fields
   * @returns Null if the passwords match, otherwise a validation error object
   */
  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmpassword')?.value;

    return password === confirmPassword ? null : { passwordsDoNotMatch: true };
  }

  /**
   * Submits the sign-up form data to the server for processing
   * Shows a success or error message in a snackbar after the API call returns
   */
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
          // Redirect to the sign-in page and show a success message
          this._router.navigate(['/sign-in']);
          this._snackbar.open('Account created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        },
        error: (err) => {
          // Show an error message in a snackbar based on the error response from the API
          if (err.error.code === 'USERNAME_ALREADY_EXISTS') {
            this._snackbar.open(err.error.message, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          } else if (err.error.code === 'VALIDATION_ERRORS') {
            const { details } = err.error;
            let message = '';
            for (let i = 0; i < details.length; i += 1) {
              const error = details[i];
              message += `${error.code}: ${error.description}`;
            }
            this._snackbar.open(message, 'Close', {
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
