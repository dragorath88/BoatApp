import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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

  /**
   * Sends a sign up request to the API with the given credentials
   * @param username - The username of the new user
   * @param password - The password of the new user
   * @param confirmpassword - The confirmed password of the new user
   * @returns An Observable of the sign up response
   */
  signUp(
    username: string,
    password: string,
    confirmpassword: string
  ): Observable<ISignUpResponse> {
    return this._http.post<ISignUpResponse>(this._apiUrl, {
      username,
      password,
      confirmpassword,
    });
  }
}
