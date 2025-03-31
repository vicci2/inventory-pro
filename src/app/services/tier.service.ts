import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TierService {

  private url: string = `${environment.apiUrl}/tiers/`;
  
  constructor(private http: HttpClient) {}
  
  getTiers(){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}`,  { headers }).pipe(
      catchError(this.handleError)
    );
  }

  getTier(id:any){
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}${id}`,  { headers }).pipe(
      catchError(this.handleError)
    );
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.detail || 'An unexpected error occurred.'));
  }
}
