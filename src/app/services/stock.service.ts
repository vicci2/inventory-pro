import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Avail } from '../interface/avail';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { Restock, Stock, StockCreate } from '../interface/stockModel';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor( private http:HttpClient) { }

  url :string= `${environment.apiUrl}/products/`

// --------------My Observables--------------   
// --------------Auto-refresh feature------------- 
private _refreshrequired=new Subject<void>();

get Refreshed(){
  return this._refreshrequired;
}

// -------x------Auto-refresh feature------x------ 
getStock(): Observable<Stock[]> {
  const headers = this.getAuthHeaders();

  return this.http.get<Stock[]>(this.url, { headers }).pipe(
    catchError(this.handleError) 
  );
}

getItem(itemId: any): Observable<Stock> {
  const headers = this.getAuthHeaders();
  return this.http.get<Stock>(`${this.url}${itemId}`, { headers }).pipe(
    catchError(this.handleError) 
  );
}

postStock(payload: StockCreate) {
  const headers = this.getAuthHeaders();
  return this.http.post(this.url, payload, { headers }).pipe(
    // console.error('API Error:', error);  // Log the error for debugging
  catchError(this.handleError) 
);   
}

updateStockItem(id: number, stockItem: any): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.put(`${this.url} ${id}`, stockItem, { headers }).pipe(
    catchError(this.handleError) 
  );
}

// http://127.0.0.1:8000/products/3
availStock(id: number,items:Avail){
  const headers = this.getAuthHeaders();
  return this.http.post(`${this.url}${id}`, items, { headers }).pipe(
    catchError(this.handleError)
  )
}

restock(values:Restock){
  const headers = this.getAuthHeaders();
  return this.http.put(this.url,values, { headers });
}

// putStock(id:number,values:any){
//   return this.http.put(this.url + "productss/" ,id, values);
// }

deleteStockItem(id: number): Observable<any> {
  const headers = this.getAuthHeaders();
  return this.http.delete(`${this.url} ${id}`, { headers }).pipe(
    catchError(this.handleError)
  );
}

// -------x-------My Observables------x-------- 

private handleError(error: HttpErrorResponse): Observable<never> {
  return throwError(() => new Error(error.error?.detail || 'An unexpected error occurred.'));
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
