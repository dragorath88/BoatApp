import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { IBoat } from '../interfaces/boat/iboat';
import { BoatApiService } from '../services/boat-api/boat-api.service';

@Component({
  selector: 'app-boat-edit',
  templateUrl: './boat-edit.component.html',
  styleUrls: ['./boat-edit.component.scss'],
})
export class BoatEditComponent implements OnInit, AfterViewInit {
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

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _boatApiService: BoatApiService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {}

  isDataLoaded = false;

  ngOnInit() {
    this._activatedRoute.params.subscribe((params) => {
      this.loadBoat(params['id']);
    });

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

  async ngAfterViewInit() {}

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

  onCancel() {
    this._router.navigate(['/boats-list']);
  }
}
