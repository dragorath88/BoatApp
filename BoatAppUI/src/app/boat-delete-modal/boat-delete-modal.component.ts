import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BoatApiService } from '../services/boat-api/boat-api.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-boat-delete-modal',
  templateUrl: './boat-delete-modal.component.html',
})
export class BoatDeleteModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<BoatDeleteModalComponent>,
    private _boatApiService: BoatApiService
  ) {}

  onCancel(): void {
    this._dialogRef.close(false);
  }

  async onDelete(): Promise<void> {
    try {
      await firstValueFrom(this._boatApiService.delete(this.data.boatId));
      this._dialogRef.close(true);
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
