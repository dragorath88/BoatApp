import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, firstValueFrom, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Buffer } from 'buffer';
import { ISignInResponse } from '../../interfaces/isign-in-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _apiUrl = '/api/auth';
  private _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private _tokenKey = 'token';
  private _tokenSubject = new BehaviorSubject<string>(
    localStorage.getItem(this._tokenKey) ?? ''
  );
  private _refreshTimer: any;

  public token$: Observable<string> = this._tokenSubject.asObservable();

  constructor(
    private readonly _http: HttpClient,
    private readonly _router: Router
  ) {
    this.scheduleRefreshToken();
  }

  // Private functions

  private isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    const now = new Date().getTime() / 1000;
    return expiry < now;
  }

  private async scheduleRefreshToken() {
    const token = this.getToken();
    if (!token) {
      return;
    }
    const tokenExpDate = new Date(
      parseInt(
        JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp
      ) * 1000
    );
    const now = new Date();
    const timeDiff = tokenExpDate.getTime() - now.getTime() - 5 * 60 * 1000; // refresh 5 minutes before expiration

    if (timeDiff > 0) {
      this._refreshTimer = setTimeout(async () => {
        try {
          const response = await firstValueFrom(this.refreshToken());
          localStorage.setItem(this._tokenKey, response.token);
          this.scheduleRefreshToken();
        } catch (error) {
          throwError(() => error);
        }
      }, timeDiff);
    }
  }

  private unscheduleRefreshToken() {
    if (this._refreshTimer) {
      clearTimeout(this._refreshTimer);
    }
  }

  // Public functions

  signIn(username: string, password: string): Observable<any> {
    return this._http
      .post<ISignInResponse>(
        `${this._apiUrl}/authenticate`,
        { username, password },
        this._httpOptions
      )
      .pipe(
        tap((response) => {
          const token = response?.token;
          if (token) {
            localStorage.setItem(this._tokenKey, token);
            this._tokenSubject.next(token);
            this.scheduleRefreshToken();
            setTimeout(() => {
              this._router.navigate(['/boats-list']);
            });
          }
        })
      );
  }

  signOut(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return new Observable();
    }

    return this._http.post(`${this._apiUrl}/logout`, null).pipe(
      tap(() => {
        this.unscheduleRefreshToken();
        localStorage.removeItem(this._tokenKey);
        this._tokenSubject.next('');
        this._router.navigate(['/sign-in']);
      })
    );
  }

  refreshToken(): Observable<any> {
    const token = this._tokenSubject.value;
    if (!token) {
      return new Observable();
    }

    return this._http
      .post<ISignInResponse>(`${this._apiUrl}/refresh-token`, null)
      .pipe(
        tap((response) => {
          const token = response?.token;
          if (token) {
            localStorage.setItem(this._tokenKey, token);
            this._tokenSubject.next(token);
            this.scheduleRefreshToken();
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this._tokenKey) ?? null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }
}
