import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { IBoat } from '../interfaces/boat/iboat';
import { BoatApiService } from '../services/boat/boat-api.service';

@Component({
  selector: 'app-boat-edit',
  templateUrl: './boat-edit.component.html',
  styleUrls: ['./boat-edit.component.scss'],
})
export class BoatEditComponent implements OnInit, AfterViewInit {
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

  @ViewChild('form') form: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private boatApiService: BoatApiService,
    private _router: Router
  ) {}

  isDataLoaded = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.loadBoat(params['id']);
    });
  }

  async ngAfterViewInit() {
    this.form.reset();
  }

  async loadBoat(id: string) {
    try {
      const boat: IBoat = await firstValueFrom(this.boatApiService.getById(id));
      this.boat = boat;
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async updateBoat() {
    try {
      await firstValueFrom(this.boatApiService.update(this.boat.id, this.boat));
      this._router.navigate(['/boats-list']);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  onCancel() {
    this._router.navigate(['/boats-list']);
  }
}