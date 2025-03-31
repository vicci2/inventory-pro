import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, Subscription } from 'rxjs';
import { Subscribe, Subscriptions, UpdateSubscription } from '../interface/subscriptions.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {


  private url: string = `${environment.apiUrl}/subscriptions`;
  
  constructor(private http: HttpClient) {}
  
  subscribe(payload: Subscribe): Observable<Subscribe> {
    return this.http.post<Subscribe>(`${this.url}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  getSubscriptions(): Observable<Subscriptions[]> {
    const headers = this.getAuthHeaders();
  
    return this.http.get<Subscriptions[]>(this.url, { headers }).pipe(
    catchError(this.handleError)
  );
  }
  
  getSubscription(itemId: any): Observable<Subscription> {
    const headers = this.getAuthHeaders();
    return this.http.get<Subscription>(`${this.url}${itemId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  updateSubscription(itemId: any, payload:UpdateSubscription): Observable<UpdateSubscription> {
    const headers = this.getAuthHeaders();
    return this.http.put<UpdateSubscription>(`${this.url}/${itemId}`,payload, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  // cancelSubscription(itemId: any): Observable<CancelSubscription> {
  
  // }

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
