import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';

import { BoatApiService } from '../services/boat-api/boat-api.service';

/**
 * Component for creating a new boat.
 */
@Component({
  selector: 'app-boat-create',
  templateUrl: './boat-create.component.html',
  styleUrls: ['./boat-create.component.scss'],
})
export class BoatCreateComponent {
  boatForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _boatApiService: BoatApiService,
    private _router: Router
  ) {
    // Initialize the form
    this.boatForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: [''],
      length: [0, [this.nullValidatorOrPattern('^[0-9]*$')]],
      brand: [''],
      year: [0, [this.nullValidatorOrPattern('^[0-9]*$')]],
      engineType: [''],
      fuelCapacity: [0, [this.nullValidatorOrPattern('^[0-9]*$')]],
      waterCapacity: [0, [this.nullValidatorOrPattern('^[0-9]*$')]],
    });
  }

  /**
   * Custom validator function to disallow null values.
   */
  nullValidatorOrPattern(pattern: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value === null || control.value === '') {
        return { nullValue: true };
      } else if (pattern && !RegExp(pattern).test(control.value)) {
        return { pattern: true };
      }
      return null;
    };
  }

  /**
   * Submits the form data to create a new boat.
   * If an error occurs, logs the error to the console.
   */
  createBoat(): void {
    if (this.boatForm.invalid) {
      return;
    }

    this._boatApiService.create(this.boatForm.value).subscribe({
      next: () => {
        this._router.navigate(['/boats-list']);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  /**
   * Navigates back to the boats list.
   */
  onCancel(): void {
    this._router.navigate(['/boats-list']);
  }
}
