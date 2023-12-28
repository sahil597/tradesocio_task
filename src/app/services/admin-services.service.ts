import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServicesService {

  // private apiUrl = 'https://win-devbp.tradesocio.com/STTC_CoverageService.svc/GenerateToken';
  private apiUrls = 'http://localhost:3000/api/v1/admin/generateToken';

  constructor(private http: HttpClient) { }

    sendPostRequest(url: string, data: any): Observable<any> {
      // Define HTTP headers if needed
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
  
      // Sending POST request
      return this.http.post(url, data, httpOptions);
    }

    login(username: string, password: string): Observable<any> {
      const url = 'your-authentication-endpoint'; // Replace with your server endpoint
      const body = { username, password }; // Request body
  
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
  
      return this.http.post(url, body, httpOptions);
    }

    generateToken(sessionId: string, userId: number): Observable<any> {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      const requestData = {
        SessionId: sessionId,
        UserID: userId
      };
  
      return this.http.post(this.apiUrls, requestData, { headers: headers });
    }
}
