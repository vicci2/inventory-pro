import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { Inventory, Item } from '../interface/item.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor( private http:HttpClient) { }

  url :string=  `${environment.apiUrl}/inventory`

// --------------My Observables-------------- 

// --------------Auto-refresh feature------------- 
private _refreshrequired=new Subject<void>();

get Refreshed(){
  return this._refreshrequired;
}

// -------x------Auto-refresh feature------x------ 
getItems(): Observable<Inventory[]> {
  const headers = this.getAuthHeaders();
  
  return this.http.get<Inventory[]>(this.url, { headers }).pipe(
    catchError(this.handleError)
  );
}

getItem(itemId: any): Observable<Item> {
  const headers = this.getAuthHeaders();
  return this.http.get<Item>(`${this.url}/${itemId}`, { headers }).pipe(
    catchError(this.handleError)
  );
  // .pipe(
  //   catchError((error) => {
  //     return throwError(() => new Error("Failed to fetch Item data."));
  //   })
  // );
}

updateItem(itemId: any): Observable<Item> {
  const headers = this.getAuthHeaders();
  return this.http.get<Item>(`${this.url}/${itemId}`, { headers }).pipe(
    catchError(this.handleError)
  );  
  // .pipe(
  //   catchError((error) => {
  //     return throwError(() => new Error("Failed to fetch Item data."));
  //   })
  // );
}

updateInventory(id: number, adjustment: number, action: string): Observable<any> {
  const headers = this.getAuthHeaders();
  // console.log(action)
  return this.http.patch(`${this.url}/${id}/${action}`, { adjustment }, { headers } ).pipe(
    catchError(this.handleError)
  );
}

private handleError(error: HttpErrorResponse): Observable<never> {
  // console.error('An error occurred:',error.error?.detail);
  return throwError(() => new Error(error.error?.detail) || 'Something went wrong. Please try again later.');
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
