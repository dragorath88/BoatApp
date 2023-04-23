import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BoatApiService } from '../services/boat-api/boat-api.service';

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
    this.boatForm = this._formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: [''],
      length: ['', [Validators.pattern('^[0-9]*$')]],
      brand: [''],
      year: ['', [Validators.pattern('^[0-9]*$')]],
      engineType: [''],
      fuelCapacity: ['', [Validators.pattern('^[0-9]*$')]],
      waterCapacity: ['', [Validators.pattern('^[0-9]*$')]],
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
