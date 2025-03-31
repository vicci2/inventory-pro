import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor( private http:HttpClient) { }

  url :string= `${environment.apiUrl}/companies/`

  // -------x------Auto-refresh feature------x------ 
  getCompany(company_id:any) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}${company_id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  deleteCo(id: number): Observable<any> {
    return this.http.delete(`${this.url} ${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // -------x------- Helper Methods ------x-------- 
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.detail || 'An unexpected error occurred.'));
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  
  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');      
    }    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
