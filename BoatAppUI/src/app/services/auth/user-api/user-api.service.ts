import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ISignUpResponse } from 'src/app/interfaces/isign-up-response';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private readonly _apiUrl = '/api/user';

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {}

  signUp(
    username: string,
    password: string,
    confirmpassword: string
  ): Observable<any> {
    return this._http.post<ISignUpResponse>(this._apiUrl, {
      username,
      password,
      confirmpassword,
    });
  }
}
