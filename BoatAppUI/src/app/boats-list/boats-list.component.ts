import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BoatApiService } from '../services/boat/boat-api.service';
import { IBoat } from '../interfaces/boat/iboat';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { BoatEditComponent } from '../boat-edit/boat-edit.component';
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _router: Router,
    private _boatApiService: BoatApiService,
    private _dialog: MatDialog
  ) {}

  ngOnInit() {}

  async ngAfterViewInit() {
    try {
      const boats: IBoat[] = await firstValueFrom(
        this._boatApiService.getAll()
      );
      this.dataSource.data = boats;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  createBoat(): void {
    this._router.navigate(['/create-boat']);
  }
  displayBoat(boatId: string): void {
    this._dialog.open(BoatDetailModalComponent, {
      data: {
        boatId,
      },
    });
  }
  editBoat(boatId: string): void {
    this._router.navigate(['/edit-boat', boatId]);
  }
  // deleteBoat(boatId: string): void {
  //   this._dialog.open(BoatDeleteModalComponent, {
  //     data: {
  //       boatId,
  //     },
  //   });
  // }

  async deleteBoat(boatId: string): Promise<void> {
    try {
      const dialogRef = this._dialog.open(BoatDeleteModalComponent, {
        data: { boatId },
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

  // onEdit(row: IBoat) {
  //   const dialogRef = this._dialog.open(BoatEditComponent, {
  //     width: '400px',
  //     data: row,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       const index = this.dataSource.data.findIndex((b) => b.id === result.id);
  //       if (index !== -1) {
  //         this.dataSource.data[index] = result;
  //         this.dataSource._updateChangeSubscription();
  //       }
  //     }
  //   });
  // }
}
