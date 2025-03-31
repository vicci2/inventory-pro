import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { SupplierBase, SupplierResponse } from '../interface/supplier.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  private _refreshrequired=new Subject<void>();

  constructor( private http:HttpClient) { }

  url :string = `${environment.apiUrl}/vendors/`

  addSupplier(payload: SupplierBase) {
    const headers = this.getAuthHeaders();
    return this.http.post(this.url, payload, { headers }).pipe(
      // console.error('API Error:', error);  // Log the error for debugging
    catchError(this.handleError) 
  );   
  }
  
  getSuppliers(): Observable<SupplierResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<SupplierResponse[]>(`${this.url}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  // getSupplier(userId: any): Observable<SupplierResponse> {
  //   const headers = this.getAuthHeaders();
  //   return this.http.get<SupplierResponse>(`${this.url}${userId}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  
  updateSupplier(id: string, user: any): Observable<any> {
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
  // ------------- Helper Methods ------------ 
}
