import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BoatApiService } from '../services/boat-api/boat-api.service';
import { IBoat } from '../interfaces/boat/iboat';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BoatDetailModalComponent } from '../boat-detail-modal/boat-detail-modal.component';
import { BoatDeleteModalComponent } from '../boat-delete-modal/boat-delete-modal.component';

@Component({
  selector: 'app-boat-list',
  templateUrl: './boats-list.component.html',
  styleUrls: ['./boats-list.component.scss'],
})
export class BoatsListComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<IBoat>();
  displayedColumns: string[] = [
    'name',
    'description',
    'type',
    'length',
    'brand',
    'year',
    'engineType',
    'fuelCapacity',
    'waterCapacity',
    'actions',
  ];
  displayedColumnsMobile: string[] = ['name', 'description', 'actions'];
  showMobileColumns = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _router: Router,
    private _boatApiService: BoatApiService,
    private _dialog: MatDialog
  ) {}

  screenSizeBreak = 992;
  isDataLoaded = false;

  ngOnInit() {
    // Check screen width on init
    this.showMobileColumns = window.innerWidth < this.screenSizeBreak;
  }

  async ngAfterViewInit() {
    try {
      const boats: IBoat[] = await firstValueFrom(
        this._boatApiService.getAll()
      );
      this.dataSource.data = boats;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isDataLoaded = true;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  createBoat(): void {
    this._router.navigate(['/create-boat']);
  }

  displayBoat(boat: IBoat): void {
    this._dialog.open(BoatDetailModalComponent, {
      data: boat,
    });
  }

  editBoat(boatId: string): void {
    this._router.navigate(['/boat-edit', boatId]);
  }

  async deleteBoat(boat: IBoat): Promise<void> {
    try {
      const dialogRef = this._dialog.open(BoatDeleteModalComponent, {
        data: { boatId: boat.id, name: boat.name },
      });

      dialogRef.afterClosed().subscribe(async (result) => {
        const boats: IBoat[] = await firstValueFrom(
          this._boatApiService.getAll()
        );
        this.dataSource.data = boats;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showMobileColumns = event.target.innerWidth < this.screenSizeBreak;
    console.log('showMobileColumns:', this.showMobileColumns);
  }
}
