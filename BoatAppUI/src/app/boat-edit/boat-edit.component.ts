import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { IBoat } from '../interfaces/boat/iboat';
import { BoatApiService } from '../services/boat-api/boat-api.service';

@Component({
  selector: 'app-boat-edit',
  templateUrl: './boat-edit.component.html',
  styleUrls: ['./boat-edit.component.scss'],
})
export class BoatEditComponent implements OnInit, AfterViewInit {
  // Initialize variables
  boatForm!: FormGroup;
  boat: IBoat = {
    id: '',
    name: '',
    description: '',
    type: '',
    length: 0,
    brand: '',
    year: 0,
    engineType: '',
    fuelCapacity: 0,
    waterCapacity: 0,
  };
  @ViewChild('form', { static: false }) form: any;
  isDataLoaded = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _boatApiService: BoatApiService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Subscribe to the route params to load the boat
    this._activatedRoute.params.subscribe((params) => {
      this.loadBoat(params['id']);
    });

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

  ngAfterViewInit() {
    // Implement any logic that needs the view to be initialized
  }

  // Custom validator function to disallow null values
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

  // Load the boat from the API and set the form values
  async loadBoat(id: string) {
    try {
      const boat: IBoat = await firstValueFrom(
        this._boatApiService.getById(id)
      );
      this.boat = boat;

      this.boatForm.setValue({
        name: boat.name,
        description: boat.description,
        type: boat.type,
        length: boat.length,
        brand: boat.brand,
        year: boat.year,
        engineType: boat.engineType,
        fuelCapacity: boat.fuelCapacity,
        waterCapacity: boat.waterCapacity,
      });

      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Update the boat on the API.
   * If the form is invalid, returns without doing anything.
   * If an error occurs, logs the error to the console.
   * If the update is successful, navigates to the "/boats-list" page.
   */
  async updateBoat() {
    try {
      if (this.boatForm.invalid) {
        return;
      }

      const updatedBoat = {
        ...this.boat,
        ...this.boatForm.value,
      };

      await firstValueFrom(
        this._boatApiService.update(updatedBoat.id, updatedBoat)
      );
      this._router.navigate(['/boats-list']);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  /**
   * Navigates to the "/boats-list" page.
   */
  onCancel() {
    this._router.navigate(['/boats-list']);
  }
}
