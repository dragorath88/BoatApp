import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface FieldValuePair {
  field: string;
  value: string;
}

@Component({
  selector: 'app-boat-detail-modal',
  templateUrl: './boat-detail-modal.component.html',
  styleUrls: ['./boat-detail-modal.component.scss'],
})
export class BoatDetailModalComponent implements OnInit {
  displayedData: FieldValuePair[] = [];

  constructor(
    public dialogRef: MatDialogRef<BoatDetailModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.displayedData = [
      { field: 'Name', value: this.data.name },
      { field: 'Description', value: this.data.description },
      { field: 'Type', value: this.data.type },
      { field: 'Length', value: this.data.length },
      { field: 'Brand', value: this.data.brand },
      { field: 'Year', value: this.data.year },
      { field: 'Engine Type', value: this.data.engineType },
      { field: 'Fuel Capacity', value: this.data.fuelCapacity },
      { field: 'Water Capacity', value: this.data.waterCapacity },
    ];
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
