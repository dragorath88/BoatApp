import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BoatApiService } from '../services/boat-api/boat-api.service';

@Component({
  selector: 'app-boat-create',
  templateUrl: './boat-create.component.html',
  styleUrls: ['./boat-create.component.scss'],
})
export class BoatCreateComponent {
  boatForm: FormGroup;

  // custom validator function to disallow null values
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

  constructor(
    private _formBuilder: FormBuilder,
    private _boatApiService: BoatApiService,
    private _router: Router
  ) {
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

  createBoat() {
    if (this.boatForm.invalid) {
      return;
    }

    try {
      this._boatApiService.create(this.boatForm.value).subscribe(() => {
        this._router.navigate(['/boats-list']);
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  onCancel() {
    this._router.navigate(['/boats-list']);
  }
}
