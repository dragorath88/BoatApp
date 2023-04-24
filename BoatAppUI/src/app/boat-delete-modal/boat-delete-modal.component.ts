import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { BoatApiService } from '../services/boat-api/boat-api.service';

/**
 * Component for displaying a modal dialog for deleting a boat.
 * The dialog has two buttons: "Cancel" and "Delete". Clicking the
 * "Cancel" button closes the dialog with a false value, while clicking
 * the "Delete" button deletes the boat and closes the dialog with a
 * true value.
 */
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

  /**
   * Closes the dialog with a false value.
   */
  onCancel(): void {
    this._dialogRef.close(false);
  }

  /**
   * Deletes the boat and closes the dialog with a true value.
   * If an error occurs, logs the error to the console.
   */
  onDelete(): void {
    this._boatApiService.delete(this.data.boatId).subscribe({
      next: () => {
        this._dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }
}
