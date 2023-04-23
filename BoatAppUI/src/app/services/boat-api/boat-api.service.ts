import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBoat } from '../../interfaces/boat/iboat';
import { IBoatCreate } from '../../interfaces/boat/iboat-create';

@Injectable({
  providedIn: 'root',
})
export class BoatApiService {
  private _apiUrl = '/api/boats';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IBoat[]> {
    return this.http.get<IBoat[]>(this._apiUrl);
  }

  getById(id: string): Observable<IBoat> {
    return this.http.get<IBoat>(`${this._apiUrl}/${id}`);
  }

  create(boat: IBoatCreate): Observable<IBoat> {
    return this.http.post<IBoat>(this._apiUrl, boat);
  }

  update(id: string, boat: IBoat): Observable<IBoat> {
    return this.http.put<IBoat>(`${this._apiUrl}/${id}`, boat);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
