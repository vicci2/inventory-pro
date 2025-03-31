import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { User } from '../interface/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _refreshrequired=new Subject<void>();

  constructor( private http:HttpClient) { }

  url :string = `${environment.apiUrl}/users/`

  // -------x------Auto-refresh feature------x------ 
  getUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.url}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  getUser(userId: any): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.url}${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  updateUser(id: string, user: any): Observable<any> {
    return this.http.put(`${this.url} ${id}`, user).pipe(
      catchError(this.handleError) 
    );
  }

  // -------x------- Helper Methods ------x-------- 
  private handleError(error: HttpErrorResponse): Observable<never> {
    return throwError(() => new Error(error.error?.detail || 'An unexpected error occurred.'));
  }
  
  triggerRefresh() {
    this._refreshrequired.next(); 
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
