import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, map, throwError, tap } from 'rxjs';
import { UserRole } from '../interface/user.model';
import { RegisterRequest, CompanyCreate, LoginRequest, TokenResponse } from '../interface/auth.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new BehaviorSubject<boolean>(!!this.getToken());

  // http://138.68.181.57:8000/auth/me
  private authApiUrl: string = `${environment.apiUrl}/auth`;
  private coApiUrl: string = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable(); // Expose user as observable
  
  constructor(private router: Router, private http: HttpClient) {
    // this.fetchCurrentUser().subscribe();
  }
  
  register(payload: RegisterRequest): Observable<any> {
    return this.http.post(`${this.authApiUrl}/register`, payload).pipe(
      catchError(this.handleError)
    );
  }

  createCo(payload: CompanyCreate): Observable<any> {
    return this.http.post(`${this.coApiUrl}/companies`, payload).pipe(
      catchError((error) => {
        // console.error('API Error:', error);  // Log the error for debugging
        return of({ success: false, message: error.error?.detail || 'An unexpected error occurred' });
      })
    );
  }

  login(credentials: LoginRequest): Observable<TokenResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<TokenResponse>(`${this.authApiUrl}/login`, credentials, { headers }).pipe(
      map((response: TokenResponse) => {
        this.storeToken(response);
        this.handleLoginRedirect()
        return response;
      }),
      catchError((error) => {
        // console.error('Login failed', error);
        throw error;
      })
    );

  }
  
  storeToken(token: TokenResponse): void {
    localStorage.setItem('access_token', token.access_token);
    this.authStatus.next(true); 
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  isAuthenticated(): Observable<boolean> {
    return this.authStatus.asObservable();
  }
  
  signOut(): void {
    localStorage.removeItem('access_token');
    this.authStatus.next(false); 
    this.router.navigate(['/home/login']);
  }

  private handleLoginRedirect(): void {
    this.fetchCurrentUser().subscribe({
      next: (user) => {
        this.redirectBasedOnRole(user.role);
      },
      error: (err) => {
        console.error('Failed to fetch user for redirection', err);
        this.signOut();
      },
    });
  }

  fetchCurrentUser(): Observable<any> {
    // if (this.isTokenExpired()) {
    //   this.signOut();
    //   return of(null);
    // }
  
    return this.http.get(`${this.authApiUrl}/me`, { headers: this.getAuthHeaders() }).pipe(
      tap((user) => this.currentUserSubject.next(user)), 
      catchError((error) => {
        this.signOut();
        this.handleError(error)
        return of(null);
      })
    );
  }

  getCurrentUserValue(): any {
    return this.currentUserSubject.value;
  }
  
  private redirectBasedOnRole(role: UserRole): void {
    switch (role) {
      case UserRole.admin:
        this.router.navigate(['/dashboard']);
        break;
      case UserRole.manager:
        this.router.navigate(['/dashboard']);
        break;
      case UserRole.supplier:
        this.router.navigate(['/profile']);
        break;
      case UserRole.user:
        this.router.navigate(['/home']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }

  // isTokenExpired(): boolean {
  //   const token = this.getToken();
  //   if (!token) return true;
  //   const decoded: any = jwtDecode(token);
  //   return decoded.exp * 1000 < Date.now();
  // }

  handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.detail || 'An unexpected error occurred.'));
  }
}
