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
  private readonly apiUrl = '/api/auth';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  private tokenKey = 'token';
  private tokenSubject = new BehaviorSubject<string>(
    localStorage.getItem(this.tokenKey) ?? ''
  );
  private refreshTimer: any;

  public token$: Observable<string> = this.tokenSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    this.scheduleRefreshToken();
  }

  public signIn(username: string, password: string): Observable<any> {
    return this.http
      .post<ISignInResponse>(
        `${this.apiUrl}/authenticate`,
        { username, password },
        this.httpOptions
      )
      .pipe(
        tap((response) => {
          const token = response?.token;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
            this.tokenSubject.next(token);
            this.scheduleRefreshToken();
          }
        })
      );
  }

  public signOut(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, null).pipe(
      tap(() => {
        this.unscheduleRefreshToken();
        localStorage.removeItem(this.tokenKey);
        this.tokenSubject.next('');
        this.router.navigate(['/sign-in']);
      })
    );
  }

  public refreshToken(): Observable<any> {
    const token = this.tokenSubject.value;
    if (!token) {
      return new Observable();
    }

    return this.http
      .post<ISignInResponse>(`${this.apiUrl}/refresh-token`, null, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        tap((response) => {
          const token = response?.token;
          if (token) {
            localStorage.setItem(this.tokenKey, token);
            this.tokenSubject.next(token);
            this.scheduleRefreshToken();
          }
        })
      );
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey) ?? null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.isTokenExpired(token);
  }

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
      this.refreshTimer = setTimeout(async () => {
        try {
          const response = await firstValueFrom(this.refreshToken());
          localStorage.setItem(this.tokenKey, response.token);
          this.scheduleRefreshToken();
        } catch (error) {
          throwError(() => error);
        }
      }, timeDiff);
    }
  }

  private unscheduleRefreshToken() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }
  }
}
