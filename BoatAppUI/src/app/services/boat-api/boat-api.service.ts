import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBoat } from '../../interfaces/boat/iboat';
import { IBoatCreate } from '../../interfaces/boat/iboat-create';

@Injectable({
  providedIn: 'root',
})
export class BoatApiService {
  private readonly _apiUrl = '/api/boats';

  constructor(private readonly _http: HttpClient) {}

  /**
   * Retrieves all boats from the API
   * @returns An observable that emits an array of boats
   */
  getAll(): Observable<IBoat[]> {
    return this._http.get<IBoat[]>(this._apiUrl);
  }

  /**
   * Retrieves a boat by its ID from the API
   * @param id The ID of the boat to retrieve
   * @returns An observable that emits the retrieved boat
   */
  getById(id: string): Observable<IBoat> {
    return this._http.get<IBoat>(`${this._apiUrl}/${id}`);
  }

  /**
   * Creates a new boat using the provided data
   * @param boat The data to create the boat
   * @returns An observable that emits the created boat
   */
  create(boat: IBoatCreate): Observable<IBoat> {
    return this._http.post<IBoat>(this._apiUrl, boat);
  }

  /**
   * Updates a boat with the provided data
   * @param id The ID of the boat to update
   * @param boat The data to update the boat
   * @returns An observable that emits the updated boat
   */
  update(id: string, boat: IBoat): Observable<IBoat> {
    return this._http.put<IBoat>(`${this._apiUrl}/${id}`, boat);
  }

  /**
   * Deletes a boat by its ID from the API
   * @param id The ID of the boat to delete
   * @returns An observable that emits void when the boat is deleted
   */
  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
