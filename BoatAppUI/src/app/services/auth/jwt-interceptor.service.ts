import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

/**
 * Interceptor that adds the JWT token to the Authorization header of HTTP requests
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  /**
   * Intercept HTTP requests and adds the Authorization header with the JWT token, if available
   * @param request The HTTP request to be intercepted
   * @param next The next interceptor in the interceptor chain
   * @returns An observable that emits the HTTP response
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authService.getToken();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request);
  }
}
