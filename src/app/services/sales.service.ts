import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { Sale, SaleCreate } from '../interface/saleModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor( private http:HttpClient) { }
  
  url :string= `${environment.apiUrl}/sales`
  
  // --------------My Observables--------------   
  // --------------Auto-refresh feature------------- 
  private _refreshrequired=new Subject<void>();
  
  get Refreshed(){
    return this._refreshrequired;
  }

  // -------x------Auto-refresh feature------x------ 
  getSales(): Observable<Sale[]> {
    const headers = this.getAuthHeaders();
  
    return this.http.get<Sale[]>(this.url, { headers }).pipe(
      catchError((error) => {
        // console.error("Error fetching sale:", error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // Handle token expiration or unauthorized error
          // console.error('Unauthorized access - maybe token expired?');
        }
        return throwError(() => new Error("Failed to fetch sale data."));
      })
    );
  }

  getSale(itemId: any): Observable<Sale> {
    const headers = this.getAuthHeaders();
    return this.http.get<Sale>(`${this.url}${itemId}`, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  postSale(payload: SaleCreate) {
    const headers = this.getAuthHeaders();
    return this.http.post(this.url, payload, { headers }).pipe(
    catchError(this.handleError) 
  );   
  }

  updateSaleItem(id: number, sleItem: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.url} ${id}`, sleItem, { headers }).pipe(
      catchError(this.handleError) 
    );
  }

  deleteSaleItem(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url} ${id}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    // console.error('An error occurred:',error.error?.detail);
    return throwError(() => new Error(error.error?.detail) || 'Something went wrong. Please try again later.');
  }
  
  triggerRefresh() {
    this._refreshrequired.next(); // Emit refresh event
  }
  
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      // You can log this, or even handle it differently, like redirecting the user to login
      throw new Error('No authentication token found');
    }
    
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  
}
