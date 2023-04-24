import {
  AfterViewInit,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { BoatApiService } from '../services/boat-api/boat-api.service';
import { BoatDeleteModalComponent } from '../boat-delete-modal/boat-delete-modal.component';
import { BoatDetailModalComponent } from '../boat-detail-modal/boat-detail-modal.component';
import { IBoat } from '../interfaces/boat/iboat';

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
  isDataLoaded = false;
  screenSizeBreak = 992;

  constructor(
    private _router: Router,
    private _boatApiService: BoatApiService,
    private _dialog: MatDialog
  ) {}

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

  // Create a new boat
  createBoat(): void {
    this._router.navigate(['/create-boat']);
  }

  // Display the details of a boat in a modal dialog
  displayBoat(boat: IBoat): void {
    this._dialog.open(BoatDetailModalComponent, {
      data: boat,
    });
  }

  // Edit an existing boat
  editBoat(boatId: string): void {
    this._router.navigate(['/boat-edit', boatId]);
  }

  // Delete an existing boat
  deleteBoat(boat: IBoat): void {
    const dialogRef = this._dialog.open(BoatDeleteModalComponent, {
      data: { boatId: boat.id, name: boat.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this._boatApiService.getAll().subscribe({
        next: (boats: IBoat[]) => {
          this.dataSource.data = boats;
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
    });
  }

  // Update the flag that determines whether mobile columns should be shown based on the screen width
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.showMobileColumns = event.target.innerWidth < this.screenSizeBreak;
    console.log('showMobileColumns:', this.showMobileColumns);
  }
}
